import React from "react";
import { Label } from "./ui/label";

export function Field(props: {
  name: string;
  label: string;
  description?: string;
  error?: string;
  children: JSX.Element;
}) {
  function renderChildren() {
    return React.cloneElement(props.children, { id: props.name });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={props.name}>{props.label}</Label>
      {renderChildren()}
      {props.error ? (
        <span className="text-red-700 text-xs">{props.error}</span>
      ) : props.description ? (
        <span className="text-gray-500 text-xs">{props.description}</span>
      ) : null}
    </div>
  );
}
