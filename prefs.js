'use strict';
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Pango = imports.gi.Pango;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const EXTENSIONDIR = Me.dir.get_path();

const HIDEWINDOWS_SETTINGS_SCHEMA = 'ar.com.azous.extensions.hidewindows';

function init() {
}


const TreeViewExample = new GObject.Class({
    Name: 'OpenWeatherExtension.Prefs.Widget',
    GTypeName: 'OpenWeatherExtensionPrefsWidget',
    Extends: Gtk.Box,

    _init: function (params) {
        this.parent(params);
        this.initWindow();
        this.refreshUI();
    },

    Window: new Gtk.Builder(),

    // Build the application's UI
    initWindow: function () {
        this.Window.add_from_file(EXTENSIONDIR + "/settings.glade");
        this.mainWidget = this.Window.get_object("main");
        this.treeview = this.Window.get_object("treeview");
        this.store = this.Window.get_object("treeview-store");


        let column = new Gtk.TreeViewColumn();

        let renderer = new Gtk.CellRendererText();
        renderer.set({ "editable": true });
        renderer.connect("edited", Lang.bind(this, this.textChanged));

        column.pack_start(renderer, null);
        column.add_attribute(renderer, "text", 0);
        this.treeview.append_column(column);

        this.loadConfig()
    },

    refreshUI: function () {
        this.store.clear();
        let titles = this.Settings.get_value("titles").deep_unpack();
        for (let i = 0; i < titles.length; i++) {
            let current = this.store.append();
            this.store.set_value(current, 0, titles[i]);
        }
        let current = this.store.append();
        this.store.set_value(current, 0, "");
    },

    loadConfig: function () {
        this.Settings = ExtensionUtils.getSettings(HIDEWINDOWS_SETTINGS_SCHEMA);
        this.Settings.connect("changed", Lang.bind(this, function () {
            this.refreshUI();
        }));
    },

    textChanged: function (_cell, path_string, new_text, _user_data) {
        let titles = this.Settings.get_value("titles").deep_unpack();
        titles[path_string] = new_text;
        if (new_text.trim() == "")
            titles.splice(path_string, 1);
        var tmpVariant = new GLib.Variant('as', titles);
        this.Settings.set_value("titles", tmpVariant);
    },

});

function buildPrefsWidget() {
    let prefs = new TreeViewExample();
    let widget = prefs.mainWidget;
    widget.show_all();
    return widget;
}