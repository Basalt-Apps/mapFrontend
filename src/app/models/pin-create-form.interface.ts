import {V2} from "./V2.class";
import {ControlsOf} from "./controls-of.type";

export interface PinCreateForm {
  name: string;
  content: string;
  pos: V2 | null,
}

