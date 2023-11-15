import * as React from "react";

const SampleIframePage = () => {
  const [fileLoaded, setFileLoaded] = React.useState("");
  React.useEffect(() => {
    if (window !== window.parent) {
      setTimeout(() => {
      window.parent.postMessage({ type: "APP_READY" }, "*");}, 1000);
    }
    return () => {};
  }, []);

  const loadFromEvent = (event) => {
    switch (event.data.type) {
      case "LOAD_RESOURCE":
        console.log("Load resource", event.data);
        setFileLoaded(event.data.payload);
        break;
      case "NO_RESOURCE": {
        console.log("no resource", event.data);
        setFileLoaded(null);
      }
    }
  };
  // A message from the parent frame can specify the file to load
  window.addEventListener("message", loadFromEvent);
  return <>{fileLoaded || "No resource loaded"}</>;
};

export default SampleIframePage;
