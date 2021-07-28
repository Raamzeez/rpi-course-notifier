import { iPageClipFetch } from "./interface/pageClipFetch";
import Pageclip from "pageclip";
import { iPageClipData } from "./interface/pageClipData";
import { isSeatOpen } from "./util/isSeatOpen";

const pageclip = new Pageclip(process.env.PAGECLIP_API_KEY);

const notify = async () => {
  const pageClipFetch: iPageClipFetch = await pageclip.fetch();
  if (pageClipFetch.status !== 200) {
    return; //Error handling here
  }
  pageClipFetch.data.filter((data: iPageClipData) => {
    if (data.archivedAt == null) {
      const CRN = parseInt(data.payload.CRN);
      const openCourse = isSeatOpen(CRN, data);
      if (openCourse) {
      }
    }
  });
};
