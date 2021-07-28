import { iPageClipPayload } from "./iPageClipPayload";

export interface iPageClipData {
  itemEid: string;
  payload: iPageClipPayload;
  createdAt: string;
  archivedAt: string | null;
}
