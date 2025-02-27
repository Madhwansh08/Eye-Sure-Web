import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Ellipse, Image as KonvaImage, Text } from "react-konva";
import Konva from "konva";
import { useSelector, useDispatch } from "react-redux";
import { addAnnotation } from "../../redux/slices/annotationSlice";

function useKonvaImage(src) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
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

const KonvaCanvas = ({ side, imageSrc, adjustments = {}, width = 800, height = 800 }) => {
  const dispatch = useDispatch();
  const { currentTool, leftImageAnnotations, rightImageAnnotations } = useSelector(
    (state) => state.annotation
  );
  const annotations = side === "left" ? leftImageAnnotations : rightImageAnnotations;
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [pendingAnnotation, setPendingAnnotation] = useState(null);
  const backgroundImage = useKonvaImage(imageSrc);

  // Cache image so filters take effect.
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, [backgroundImage, adjustments]);

  useEffect(() => {
    if (side === "left") {
      localStorage.setItem("annotations-left", JSON.stringify(leftImageAnnotations));
    } else {
      localStorage.setItem("annotations-right", JSON.stringify(rightImageAnnotations));
    }
  }, [leftImageAnnotations, rightImageAnnotations, side]);

  const handleMouseDown = (e) => {
    if (!currentTool) return;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    setIsDrawing(true);
    switch (currentTool) {
      case "rectangle":
        setNewShape({
          type: "rectangle",
          x: pointer.x,
          y: pointer.y,
          width: 0,
          height: 0,
          stroke: "blue",
          strokeWidth: 2,
          id: `rect-${Date.now()}`,
        });
        break;
      case "oval":
        setNewShape({
          type: "oval",
          x: pointer.x,
          y: pointer.y,
          radiusX: 0,
          radiusY: 0,
          stroke: "red",
          strokeWidth: 2,
          id: `oval-${Date.now()}`,
        });
        break;
      case "point":
        setNewShape({
          type: "point",
          x: pointer.x,
          y: pointer.y,
          radius: 5,
          fill: "green",
          id: `point-${Date.now()}`,
        });
        setIsDrawing(true);
        break;
      default:
        break;
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
        height: pointer.y - prev.y,
      }));
    } else if (newShape.type === "oval") {
      setNewShape((prev) => ({
        ...prev,
        radiusX: Math.abs(pointer.x - prev.x),
        radiusY: Math.abs(pointer.y - prev.y),
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
    dispatch(addAnnotation({ side, annotation: annotatedShape }));
    setPendingAnnotation(null);
    setShowLabelModal(false);
  };

  const handleLabelCancel = () => {
    dispatch(addAnnotation({ side, annotation: { ...pendingAnnotation, label: "" } }));
    setPendingAnnotation(null);
    setShowLabelModal(false);
  };

  return (
    <div style={{ width, height }}>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
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
                Konva.Filters.Saturate,
                adjustments.negative ? Konva.Filters.Invert : undefined,
              ].filter(Boolean)}
              brightness={adjustments.brightness || 0}
              contrast={adjustments.contrast || 0}
              saturate={adjustments.saturation || 0}
            />
          )}
          {annotations.map((ann) => (
            <React.Fragment key={ann.id}>
              {ann.type === "rectangle" && (
                <Rect
                  x={ann.x}
                  y={ann.y}
                  width={ann.width}
                  height={ann.height}
                  stroke={ann.stroke}
                  strokeWidth={ann.strokeWidth || 2}
                />
              )}
              {ann.type === "oval" && (
                <Ellipse
                  x={ann.x}
                  y={ann.y}
                  radiusX={ann.radiusX}
                  radiusY={ann.radiusY}
                  stroke={ann.stroke}
                  strokeWidth={ann.strokeWidth || 2}
                />
              )}
              {ann.type === "point" && (
                <Circle x={ann.x} y={ann.y} radius={ann.radius} fill={ann.fill} />
              )}
              {ann.label !== undefined && (
                <Text
                  text={ann.label}
                  x={ann.x}
                  y={ann.type === "point" ? ann.y + 8 : ann.y - 20}
                  fontSize={16}
                  fill="black"
                  fontStyle="bold"
                />
              )}
            </React.Fragment>
          ))}
          {newShape &&
            (newShape.type === "rectangle" || newShape.type === "oval") &&
            (newShape.type === "rectangle" ? (
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
            ))}
        </Layer>
      </Stage>
      {showLabelModal && (
        <LabelModal onSubmit={handleLabelSubmit} onCancel={handleLabelCancel} />
      )}
    </div>
  );
};

export default KonvaCanvas;
