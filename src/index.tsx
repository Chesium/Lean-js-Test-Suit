import * as lean from "lean-client-js-browser";

const leanJsOpts: lean.LeanJsOpts = {
  javascript: "lean_js_js.js",
  libraryZip: "library.zip",
  libraryMeta: "library.info.json",
  libraryOleanMap: "library.olean_map.json",
  libraryKey: "library",
  webassemblyJs: "lean_js_wasm.js",
  webassemblyWasm: "lean_js_wasm.wasm",
  dbName: "leanlibrary",
};

window.onload = () => {
  const p = document.createElement("p");
  p.innerText = "Look at the output in the console.";
  document.body.appendChild(p);
  
  const prefix = ".";
  const opts: lean.LeanJsOpts = leanJsOpts;

  const transport = new lean.WebWorkerTransport(opts);
  const server = new lean.Server(transport);
  server.error.on((err) => console.log("error:", err));
  server.allMessages.on((allMessages) => console.log("messages:", allMessages.msgs));
  // emscripten lean never fires 'tasks' (requires MULTI_THREAD)
  server.tasks.on((currentTasks) => console.log("tasks:", currentTasks.tasks));

  (self as any).server = server; // allow debugging from the console

  server.connect();

  const testfile =
    "" +
    "variables p q r s : Prop\n" +
    "theorem my_and_comm : p /\\ q <-> q /\\ p :=\n" +
    "iff.intro\n" +
    "  (assume Hpq : p /\\ q,\n" +
    "    and.intro (and.elim_right Hpq) (and.elim_left Hpq))\n" +
    "  (assume Hqp : q /\\ p,\n" +
    "    and.intro (and.elim_right Hqp) (and.elim_left Hqp))\n" +
    "#check @nat.rec_on\n" +
    '#print "end of file!"\n';

  server.sync("test.lean", testfile).catch((err) => console.log("error while syncing file:", err));

  server
    .info("test.lean", 3, 0)
    .then((res) => console.log(`got info: ${JSON.stringify(res)}`))
    .catch((err) => console.log("error while getting info:", err));
};