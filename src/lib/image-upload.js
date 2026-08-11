/** Max upload size per image (1.5MB). */
export const MAX_IMAGE_BYTES = Math.floor(1.5 * 1024 * 1024);
export const MAX_IMAGE_LABEL = "1.5MB";

export function isImageFile(file) {
  return Boolean(file && typeof file.type === "string" && file.type.startsWith("image/"));
}

/**
 * @param {File|null|undefined} file
 * @param {{ field?: string }} [options]
 * @returns {{ ok: boolean, message: string }}
 */
export function validateImageFile(file, { field = "Image" } = {}) {
  if (!file) {
    return { ok: false, message: `${field} is required.` };
  }
  if (!isImageFile(file)) {
    return { ok: false, message: `${field} must be an image file.` };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: `${field} must be ${MAX_IMAGE_LABEL} or smaller.`,
    };
  }
  return { ok: true, message: "" };
}

/**
 * @param {FileList|File[]|null|undefined} fileList
 * @returns {File[]}
 */
export function imageFilesFromList(fileList) {
  return Array.from(fileList || []).filter(isImageFile);
}
