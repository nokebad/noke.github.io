/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// canvasPresentationIndex.ts
var canvasPresentationIndex_exports = {};
__export(canvasPresentationIndex_exports, {
  default: () => CanvasPresentation
});
module.exports = __toCommonJS(canvasPresentationIndex_exports);
var import_obsidian = require("obsidian");
var CanvasPresentation = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.currentSlide = [];
    this.currentSlideNum = 0;
    this.direction = "next";
    this.selectedNodeSet = /* @__PURE__ */ new Set();
  }
  async onload() {
    this.addCommand({
      id: "next-group-in-viewport",
      name: "Next Group In ViewPort",
      checkCallback: (checking) => {
        const canvasView = this.app.workspace.getActiveViewOfType(import_obsidian.ItemView);
        if ((canvasView == null ? void 0 : canvasView.getViewType()) === "canvas") {
          if (!checking) {
            const canvas = canvasView.canvas;
            const groups = this.getAllGroupNodeInViewPort(canvasView);
            if (canvas.selection.size === 0) {
              canvas.deselectAll();
              canvas.select(groups[0]);
              canvas.zoomToSelection();
              return;
            }
            const selectedNode = canvas.selection.entries().next().value[1];
            const restGroups = groups.filter((group) => {
              return group.x >= selectedNode.x && group.id !== selectedNode.id;
            });
            if (restGroups.length === 0) {
              canvas.deselectAll();
              canvas.select(groups[0]);
              canvas.zoomToSelection();
              return;
            }
            canvas.deselectAll();
            canvas.select(restGroups[0]);
            canvas.zoomToSelection();
            return;
          }
          return true;
        }
      }
    });
    this.addCommand({
      id: "previous-group-in-viewport",
      name: "Previous Group In ViewPort",
      checkCallback: (checking) => {
        const canvasView = this.app.workspace.getActiveViewOfType(import_obsidian.ItemView);
        if ((canvasView == null ? void 0 : canvasView.getViewType()) === "canvas") {
          if (!checking) {
            const canvas = canvasView.canvas;
            const groups = this.getAllGroupNodeInViewPort(canvasView);
            if (canvas.selection.size === 0) {
              canvas.deselectAll();
              canvas.select(groups[groups.length - 1]);
              canvas.zoomToSelection();
              return;
            }
            const selectedNode = canvas.selection.entries().next().value[1];
            const restGroups = groups.filter((group) => {
              return group.x <= selectedNode.x && group.id !== selectedNode.id;
            });
            if (restGroups.length === 0) {
              canvas.deselectAll();
              canvas.select(groups[groups.length - 1]);
              canvas.zoomToSelection();
              return;
            }
            canvas.deselectAll();
            canvas.select(restGroups[restGroups.length - 1]);
            canvas.zoomToSelection();
            return;
          }
          return true;
        }
      }
    });
    this.addCommand({
      id: "mark-slide-number",
      name: "Mark Slide Number",
      checkCallback: (checking) => {
        const canvasView = this.app.workspace.getActiveViewOfType(import_obsidian.ItemView);
        const findNode = (map) => {
          for (const value of map) {
            if ((value == null ? void 0 : value.type) === "text" && (value == null ? void 0 : value.text.startsWith("Slide:\n"))) {
              return value;
            }
          }
          return false;
        };
        if ((canvasView == null ? void 0 : canvasView.getViewType()) === "canvas") {
          if (!checking) {
            const canvas = canvasView.canvas;
            if (!canvas)
              return;
            const nodes = canvas.getData().nodes;
            if (this.currentView !== canvasView)
              this.currentView = canvasView;
            if (Array.from(canvas.selection).length === 0) {
              new import_obsidian.Notice("Please select at least one node");
              return;
            }
            let node = findNode(nodes);
            if (!node) {
              let selectionArray = Array.from(canvas.selection);
              if (!(0, import_obsidian.requireApiVersion)("1.1.10"))
                node = canvas.createTextNode({ x: -200, y: -200 }, { height: 200, width: 200 }, true);
              else {
                node = canvas.createTextNode({
                  pos: {
                    x: -200,
                    y: -200,
                    height: 200,
                    width: 200
                  },
                  text: "",
                  focus: false,
                  save: true,
                  size: {
                    height: 200,
                    width: 200,
                    x: -200,
                    y: -200
                  }
                });
              }
              canvas.deselectAll();
              selectionArray.forEach((item) => {
                const node2 = canvas.nodes.get(item.id);
                if (node2)
                  canvas.select(node2);
              });
            }
            const slideNode = canvas.nodes.get(node.id);
            if (!(node == null ? void 0 : node.text.contains("Slide:\n"))) {
              slideNode.setText("Slide:\n");
              canvas.requestSave();
            }
            const nodesArray = Array.from(canvas.selection);
            if (nodesArray.length > 0) {
              let currentString = "- ";
              nodesArray.forEach((nodeItem) => {
                currentString += (nodeItem == null ? void 0 : nodeItem.id) + ", ";
              });
              currentString = currentString.slice(0, -2);
              slideNode.setText((slideNode == null ? void 0 : slideNode.text) + currentString + "\n");
              canvas.requestSave();
            }
          }
          return true;
        }
      }
    });
    this.addCommand({
      id: "next-slide",
      name: "Next Slide",
      checkCallback: (checking) => {
        var _a;
        const canvasView = this.app.workspace.getActiveViewOfType(import_obsidian.ItemView);
        const findSlideNode = (map) => {
          for (const value of map) {
            if ((value == null ? void 0 : value.type) === "text" && (value == null ? void 0 : value.text.startsWith("Slide:\n"))) {
              return value;
            }
          }
          return false;
        };
        if ((canvasView == null ? void 0 : canvasView.getViewType()) === "canvas") {
          if (!checking) {
            const canvas = canvasView.canvas;
            if (!canvas)
              return;
            const nodes = canvas.getData().nodes;
            const slideNode = canvas.nodes.get(findSlideNode(nodes).id);
            if (!slideNode) {
              new import_obsidian.Notice("No slide node found, mark any node as slide before");
              return;
            }
            const slideText = slideNode == null ? void 0 : slideNode.text;
            this.currentSlide = slideText.split("\n").filter((i) => i && i.trim());
            this.currentSlide.shift();
            canvas.deselectAll();
            if (this.currentSlideNum === this.currentSlide.length)
              this.currentSlideNum = 0;
            const slideNodes = (_a = this.currentSlide[this.direction === "next" ? this.currentSlideNum : this.currentSlideNum + 1 === this.currentSlide.length ? 0 : this.currentSlideNum + 1]) == null ? void 0 : _a.slice(2).split(", ");
            slideNodes.forEach((id) => {
              const node = canvas.nodes.get(id);
              if (node)
                canvas.select(node);
            });
            this.direction = "next";
            canvas.zoomToSelection();
            if (!(this.currentSlideNum === 0 && this.currentSlide.length === 1))
              this.currentSlideNum = this.currentSlideNum + 1;
          }
          return true;
        }
      }
    });
    this.addCommand({
      id: "previous-slide",
      name: "Previous Slide",
      checkCallback: (checking) => {
        var _a;
        const canvasView = this.app.workspace.getActiveViewOfType(import_obsidian.ItemView);
        const findSlideNode = (map) => {
          for (const value of map) {
            if ((value == null ? void 0 : value.type) === "text" && (value == null ? void 0 : value.text.startsWith("Slide:\n"))) {
              return value;
            }
          }
          return false;
        };
        if ((canvasView == null ? void 0 : canvasView.getViewType()) === "canvas") {
          if (!checking) {
            const canvas = canvasView.canvas;
            if (!canvas)
              return;
            const nodes = canvas.getData().nodes;
            const slideNode = canvas.nodes.get(findSlideNode(nodes).id);
            if (!slideNode) {
              new import_obsidian.Notice("No slide node found, mark any node as slide before");
              return;
            }
            const slideText = slideNode == null ? void 0 : slideNode.text;
            this.currentSlide = slideText.split("\n").filter((i) => i && i.trim());
            this.currentSlide.shift();
            canvas.deselectAll();
            let currentSlideNum = this.currentSlideNum === 0 ? this.currentSlide.length - 1 : this.currentSlideNum - 1;
            if (this.currentSlideNum === this.currentSlide.length && this.direction !== "previous")
              currentSlideNum = this.currentSlide.length - 2;
            const slideNodes = (_a = this.currentSlide[currentSlideNum]) == null ? void 0 : _a.slice(2).split(", ");
            slideNodes.forEach((id) => {
              const node = canvas.nodes.get(id);
              if (node)
                canvas.select(node);
            });
            this.direction = "previous";
            canvas.zoomToSelection();
            if (this.currentSlideNum === 0)
              this.currentSlideNum = this.currentSlide.length - 1;
            else
              this.currentSlideNum = this.currentSlideNum - 1;
          }
          return true;
        }
      }
    });
  }
  getAllGroupNode(canvasView) {
    const canvas = canvasView.canvas;
    const groups = Array.from(canvas.nodes);
    const groupsArray = [];
    groups.forEach((group) => {
      var _a;
      if (((_a = group[1]) == null ? void 0 : _a.renderedZIndex) === -1)
        groupsArray.push(group[1]);
    });
    groupsArray.sort((a, b) => a.x - b.x);
    return groupsArray;
  }
  getAllGroupNodeInViewPort(canvasView) {
    const canvas = canvasView.canvas;
    const groups = canvas.getViewportNodes();
    const groupsArray = [];
    groups.forEach((group) => {
      if ((group == null ? void 0 : group.renderedZIndex) === -1)
        groupsArray.push(group);
    });
    console.log(groupsArray);
    groupsArray.sort((a, b) => a.x - b.x);
    return groupsArray;
  }
  onunload() {
  }
};
