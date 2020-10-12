'use strict';

const HIDEWINDOWS_SETTINGS_SCHEMA = 'ar.com.azous.extensions.hidewindows';

const isOverviewWindow = imports.ui.workspace.Workspace.prototype._isOverviewWindow;
const getWindows = imports.ui.altTab.getWindows;

const Lang = imports.lang;
const ExtensionUtils = imports.misc.extensionUtils;
const Settings = ExtensionUtils.getSettings(HIDEWINDOWS_SETTINGS_SCHEMA);
var titles = [];


function match(win) {
  log(titles);
  return !titles.find(title => win.title == title);
}

function init() {
}

function enable() {
  titles = Settings.get_value("titles").deep_unpack();
  Settings.connect("changed", Lang.bind(this, function () {
    titles = Settings.get_value("titles").deep_unpack();
  }));

  imports.ui.workspace.Workspace.prototype._isOverviewWindow = (win) => {
    const show = isOverviewWindow(win);
    return show && match(win.get_meta_window());
  };

  imports.ui.altTab.getWindows = (workspace) => {
    const windows = getWindows(workspace);
    return windows.filter((w, i, a) => {
      return match(w);
    });
  };

}

function disable() {
  imports.ui.workspace.Workspace.prototype._isOverviewWindow = isOverviewWindow;
  imports.ui.altTab.getWindows = getWindows;
  Settings.run_dispose()
}
