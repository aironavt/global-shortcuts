import GlobalShortcuts from 'global-shortcuts';

const globalShortcuts = new GlobalShortcuts();

chrome.commands.onCommand.addListener(globalShortcuts.getCommandHandler());
