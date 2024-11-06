// components/DraggableImageContainer.tsx
import React from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./draggable-image-containr.module.css";
import Image from "next/image";
import type { Media } from "@prisma/client";

interface FileWithPreview extends File {
  preview: string;
}

type Images = Media[] | FileWithPreview[];

// type Image = {
//   id: number;
//   src: string;
//   alt: string;
// };

// const initialImages: Image[] = [
//   {
//     id: 1,
//     src: "https://images.unsplash.com/photo-1725203574073-79922f64110a?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Image 1",
//   },
//   {
//     id: 2,
//     src: "https://images.unsplash.com/photo-1727707185480-a50e6090b58c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Image 2",
//   },
//   {
//     id: 3,
//     src: "https://images.unsplash.com/photo-1727775805114-a87c6bcaf9db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     alt: "Image 3",
//   },
// ];

const DraggableImage: React.FC<{
  image: Media;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}> = ({ image, index, moveImage }) => {
  const ref = React.useRef<HTMLImageElement>(null);

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Image
      ref={ref}
      src={image.imageUrl}
      alt={image.altText || ""}
      width={100}
      height={100}
      className={`${styles.draggable} ${isDragging ? styles.dragging : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    />
  );
};

const DraggableImageContainer = ({ savedImages }: { savedImages: Media[] }) => {
  const [images, setImages] = React.useState<Media[]>(savedImages);

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedItem] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedItem);
    setImages(updatedImages);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.imageContainer}>
        {images.map((image, index) => (
          <DraggableImage
            key={image.id}
            image={image}
            index={index}
            moveImage={moveImage}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default DraggableImageContainer;
