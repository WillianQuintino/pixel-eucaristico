import { permanentRedirect } from "next/navigation";
import { DOMUS_SUPPORT_PATH } from "../links";

// O DOMUS saiu do teste fechado e está publicado no Google Play.
// O endereço antigo do beta leva à página de suporte.
export default function DomusBetaPage() {
  permanentRedirect(DOMUS_SUPPORT_PATH);
}
