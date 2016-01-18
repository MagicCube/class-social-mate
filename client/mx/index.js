if (typeof(jQuery) === "undefined" || jQuery === null)
{
    throw new Error("jQuery is not found in the context. jQuery is MXFramework's dependency.");
}

import "./javascript-extensions";

import Event from "./event/event";
import EventProvider from "./event/event-provider";
import Component from "./component/component";
import View from "./view/view";
import Application from "./app/application";
import Route from "./route/route";
import Router from "./route/router";

export {
    Event,
    EventProvider,
    Component,
    View,
    Application,
    Route,
    Router
};
