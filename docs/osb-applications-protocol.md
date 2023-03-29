# OSB and applications communication protocol

OSB communicates with the applications with a few message sent through parent-child frame `postMessage`.

Main events are:

| Event  | explanation  | Payload  | Sender  | App target State  |
|---|---|---|---|---|
| APP_READY  | The application communicates the osb parent frame it's ready to receive commands. this is necessary as the frame onload message does not take into  account the interval required by jupyterhub  | `{type: "APP_READY"}`  | Application  | WAIT_RESOURCE  |
| LOAD_RESOURCE  | OSB tells the application to load a specific resource. It is either sent as response to the APP_READY or to an explicit action of the user to load a resource  | `{type: "LOAD_RESOURCE", payload: "[RESOURCE URI]"}`  | OSB  | RESOURCE_LOADED |
| NO_RESOURCE  | OSB tells the application that no resource is available to be loaded. The application will show a default screen | `{type: "NO_RESOURCE"}`  | OSB | DEFAULT_IDLE  |
| NEW_RESOURCE  | The application tells OSB that a new resource has been potentially created. OSB scans the workspace to lookup for new resources | `{type: "NEW_RESOURCE"}`  | OSB | <no change>  |


## Examples

### Send ready message

```Javascript
if (window !== window.parent) {
    window.parent.postMessage({ type: "APP_READY" }, "*");
}
```
### Listen to messages

```Javascript
const loadFromEvent = (event) => {
    switch (event.data.type) {
      case "LOAD_RESOURCE":
        console.log("Load resource", event);
        setFileLoaded(event.data);
        break;
      case "NO_RESOURCE": {
        console.log("no resource", event);
        setFileLoaded(null);
      }
    }
    // Here we would expect some cross-origin check, but we don't do anything more than load a file here
    if (
      typeof event.data == "string" &&
      event.origin == window.parent.location.origin
    ) {
      console.log("Event", event);
      setFileLoaded(event.data);
    }
  };
  // A message from the parent frame can specify the file to load
  window.addEventListener("message", loadFromEvent);
```


### Send new resource message

```Javascript
if (window !== window.parent) {
    window.parent.postMessage({ type: "NEW_RESOURCE" }, "*");
}
```

As shown in the example, there is no need to tell OSB details about
the new resource(s), as OSB scans the workspace directory to check
for new resources.