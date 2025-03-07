// src/components/analysis/KonvaCanvas.jsx
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Ellipse, Image as KonvaImage, Text } from "react-konva";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";
import { addAnnotation } from "../../redux/slices/annotationSlice";

Konva.Filters.RGBChannel = function (imageData) {
  const data = imageData.data;
  const rEnabled = this.getAttr("rgbRed");
  const gEnabled = this.getAttr("rgbGreen");
  const bEnabled = this.getAttr("rgbBlue");
  for (let i = 0; i < data.length; i += 4) {
    if (!rEnabled && !gEnabled && !bEnabled) {
      data[i + 3] = 0;
    } else {
      if (!rEnabled) data[i] = 0;
      if (!gEnabled) data[i + 1] = 0;
      if (!bEnabled) data[i + 2] = 0;
    }
  }
};

function useKonvaImage(src) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);
  return image;
}

const LabelModal = ({ onSubmit, onCancel }) => {
  const [labelText, setLabelText] = useState("");
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Enter Annotation Label</h2>
        <input
          type="text"
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
          placeholder="Enter label..."
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              onCancel();
              setLabelText("");
            }}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(labelText);
              setLabelText("");
            }}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const KonvaCanvas = ({
  reportId,
  side,          // "left" or "right"
  imageSrc,
  adjustments = {},
  width = 800,
  height = 800,
  resetPanTrigger,
  currentTool // from parent or Redux
}) => {
  const dispatch = useDispatch();
  // Select current annotations for this report and side from Redux
  const annotations = useSelector((state) => {
    const reportData = state.annotation.byReportId[reportId];
    if (!reportData) return [];
    return side === "left" ? reportData.leftImageAnnotations : reportData.rightImageAnnotations;
  });

  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [pendingAnnotation, setPendingAnnotation] = useState(null);
  const backgroundImage = useKonvaImage(imageSrc);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, [backgroundImage, adjustments]);

  useEffect(() => {
    if (stageRef.current) {
      const currentZoom = adjustments.zoom || 1;
      const newX = (width - width * currentZoom) / 2;
      const newY = (height - height * currentZoom) / 2;
      stageRef.current.position({ x: newX, y: newY });
      stageRef.current.batchDraw();
    }
  }, [resetPanTrigger, width, height, adjustments.zoom]);

  const handleMouseDown = (e) => {
    if (!currentTool) return;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    setIsDrawing(true);
    if (currentTool === "rectangle") {
      setNewShape({
        type: "rectangle",
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        stroke: "blue",
        strokeWidth: 2,
        id: `rect-${Date.now()}`
      });
    } else if (currentTool === "oval") {
      setNewShape({
        type: "oval",
        x: pointer.x,
        y: pointer.y,
        radiusX: 0,
        radiusY: 0,
        stroke: "red",
        strokeWidth: 2,
        id: `oval-${Date.now()}`
      });
    } else if (currentTool === "point") {
      const pointShape = {
        type: "point",
        x: pointer.x,
        y: pointer.y,
        radius: 5,
        fill: "green",
        id: `point-${Date.now()}`
      };
      setPendingAnnotation(pointShape);
      setShowLabelModal(true);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newShape) return;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (newShape.type === "rectangle") {
      setNewShape((prev) => ({
        ...prev,
        width: pointer.x - prev.x,
        height: pointer.y - prev.y
      }));
    } else if (newShape.type === "oval") {
      setNewShape((prev) => ({
        ...prev,
        radiusX: Math.abs(pointer.x - prev.x),
        radiusY: Math.abs(pointer.y - prev.y)
      }));
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !newShape) {
      setIsDrawing(false);
      return;
    }
    setPendingAnnotation(newShape);
    setShowLabelModal(true);
    setIsDrawing(false);
    setNewShape(null);
  };

  const handleLabelSubmit = (label) => {
    const annotatedShape = { ...pendingAnnotation, label };
    dispatch(addAnnotation({ reportId, side, annotation: annotatedShape }));
    setPendingAnnotation(null);
    setShowLabelModal(false);
  };

  const handleLabelCancel = () => {
    setPendingAnnotation(null);
    setShowLabelModal(false);
  };

  const dragBoundFunc = (pos) => {
    const scale = adjustments.zoom || 1;
    const minX = width - width * scale;
    const minY = height - height * scale;
    const maxX = 0;
    const maxY = 0;
    let x = pos.x;
    let y = pos.y;
    if (x > maxX) x = maxX;
    if (x < minX) x = minX;
    if (y > maxY) y = maxY;
    if (y < minY) y = minY;
    return { x, y };
  };

  return (
    <div style={{ width, height }}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        draggable={adjustments.zoom > 1}
        dragBoundFunc={dragBoundFunc}
        scaleX={adjustments.zoom || 1}
        scaleY={adjustments.zoom || 1}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {backgroundImage && (
            <KonvaImage
              ref={imageRef}
              image={backgroundImage}
              x={0}
              y={0}
              width={width}
              height={height}
              filters={[
                Konva.Filters.Brighten,
                Konva.Filters.Contrast,
                adjustments.negative ? Konva.Filters.Invert : undefined,
                (adjustments.rgbRed !== undefined &&
                  adjustments.rgbGreen !== undefined &&
                  adjustments.rgbBlue !== undefined)
                  ? Konva.Filters.RGBChannel
                  : undefined
              ].filter(Boolean)}
              brightness={adjustments.brightness || 0}
              contrast={adjustments.contrast || 0}
              rgbRed={adjustments.rgbRed}
              rgbGreen={adjustments.rgbGreen}
              rgbBlue={adjustments.rgbBlue}
            />
          )}
          {annotations.map((ann) => {
            const x = Number(ann.x);
            const y = Number(ann.y);
            return (
              <React.Fragment key={ann.id}>
                {ann.type === "rectangle" && (
                  <Rect
                    x={x}
                    y={y}
                    width={Number(ann.width)}
                    height={Number(ann.height)}
                    stroke={ann.stroke}
                    strokeWidth={ann.strokeWidth || 2}
                  />
                )}
                {ann.type === "oval" && (
                  <Ellipse
                    x={x}
                    y={y}
                    radiusX={Number(ann.radiusX)}
                    radiusY={Number(ann.radiusY)}
                    stroke={ann.stroke}
                    strokeWidth={ann.strokeWidth || 2}
                  />
                )}
                {ann.type === "point" && (
                  <Circle
                    x={x}
                    y={y}
                    radius={Number(ann.radius)}
                    fill={ann.fill}
                  />
                )}
                {ann.label && (
                  <Text
                    text={ann.label}
                    x={x}
                    y={ann.type === "point" ? y + 8 : y - 20}
                    fontSize={16}
                    fill="black"
                    fontStyle="bold"
                  />
                )}
              </React.Fragment>
            );
          })}
          {newShape && (newShape.type === "rectangle" || newShape.type === "oval") && (
            newShape.type === "rectangle" ? (
              <Rect
                x={newShape.x}
                y={newShape.y}
                width={newShape.width}
                height={newShape.height}
                stroke={newShape.stroke}
                strokeWidth={newShape.strokeWidth || 2}
              />
            ) : (
              <Ellipse
                x={newShape.x}
                y={newShape.y}
                radiusX={newShape.radiusX}
                radiusY={newShape.radiusY}
                stroke={newShape.stroke}
                strokeWidth={newShape.strokeWidth || 2}
              />
            )
          )}
        </Layer>
      </Stage>
      {showLabelModal && (
        <LabelModal onSubmit={handleLabelSubmit} onCancel={handleLabelCancel} />
      )}
    </div>
  );
};

export default KonvaCanvas;
