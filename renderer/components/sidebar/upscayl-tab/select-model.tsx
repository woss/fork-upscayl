"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Maximize2, SwatchBookIcon, X } from "lucide-react";
import { ModelId, MODELS } from "@common/models-list";
import { useAtom, useAtomValue } from "jotai";
import { selectedModelIdAtom } from "@/atoms/user-settings-atom";
import { customModelIdsAtom } from "@/atoms/models-list-atom";
import useTranslation from "@/components/hooks/use-translation";

export default function SelectModel() {
  const t = useTranslation();
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom);
  console.log("🚀 => selectedModelId:", selectedModelId);

  const customModelIds = useAtomValue(customModelIdsAtom);
  const [open, setOpen] = useState(false);
  const [zoomedModel, setZoomedModel] = useState<ModelId | null>(null);

  const handleModelSelect = (model: ModelId | string) => {
    console.log("🚀 => model:", model);

    setSelectedModelId(model);
    setOpen(false);
  };

  const handleZoom = (event: React.MouseEvent, model: ModelId) => {
    event.stopPropagation();
    setZoomedModel(model);
  };

  return (
    <div className="flex flex-col gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="btn btn-primary justify-start border-border">
            <SwatchBookIcon className="mr-2 h-5 w-5" />
            {MODELS[selectedModelId]?.name || selectedModelId}
          </button>
        </DialogTrigger>
        <DialogContent className="z-50 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("APP.MODEL_SELECTION.DESCRIPTION")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] pr-4">
            <div className="grid gap-4">
              {Object.entries(MODELS).map((modelData) => {
                const modelId = modelData[0] as ModelId;
                const model = modelData[1];
                return (
                  <button
                    key={modelId}
                    className="btn h-auto w-full flex-col items-start p-4"
                    onClick={() => handleModelSelect(modelId)}
                  >
                    <div className="mb-2 font-semibold">{model.name}</div>
                    <div className="relative h-52 w-full overflow-hidden rounded-md">
                      <div className="flex h-full w-full">
                        <img
                          src={`/model-comparison/${model.id}/before.webp`}
                          alt={`${model.name} Before`}
                          className="h-full w-1/2 object-cover"
                        />
                        <img
                          src={`/model-comparison/${model.id}/after.webp`}
                          alt={`${model.name} After`}
                          className="h-full w-1/2 object-cover"
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-full w-px bg-white opacity-50"></div>
                      </div>
                      <div className="absolute bottom-2 left-2 rounded bg-black bg-opacity-50 px-1 text-xs text-white">
                        Before
                      </div>
                      <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-50 px-1 text-xs text-white">
                        After
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={(e) => handleZoom(e, modelId)}
                      >
                        <Maximize2 className="h-4 w-4" />
                        <span className="sr-only">Zoom</span>
                      </Button>
                    </div>
                  </button>
                );
              })}
              <p className="font-semibold text-base-content">
                Imported Custom Models
              </p>
              {customModelIds.map((customModel) => {
                return (
                  <button
                    key={customModel}
                    className="btn h-auto w-full flex-col items-start p-4"
                    onClick={() => handleModelSelect(customModel)}
                  >
                    {customModel}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!zoomedModel}
        onOpenChange={(open) => !open && setZoomedModel(null)}
      >
        <DialogContent
          className="h-screen w-screen max-w-full p-0"
          hideCloseButton
        >
          <div className="relative flex h-full w-full items-center justify-center bg-black">
            <div className="flex h-full w-full">
              <div className="relative h-full w-1/2">
                <img
                  src={`/model-comparison/${MODELS[zoomedModel]?.id}/before.webp`}
                  alt={`${MODELS[zoomedModel]?.name} Before`}
                  className="h-full w-full object-contain"
                />
                <div className="absolute bottom-4 left-4 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                  Before
                </div>
              </div>
              <div className="relative h-full w-1/2">
                <img
                  src={`/model-comparison/${MODELS[zoomedModel]?.id}/after.webp`}
                  alt={`${MODELS[zoomedModel]?.name} After`}
                  className="h-full w-full object-contain"
                />
                <div className="absolute bottom-4 right-4 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                  After
                </div>
              </div>
            </div>
            <button
              className="btn btn-circle btn-secondary absolute right-4 top-4"
              onClick={() => setZoomedModel(null)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
