import Application from "./app/application";

const app = new Application("app");

$(() => {
    app.placeAt(document.body);
});

window.app = app;
export default app;
