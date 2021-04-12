export default class ImageModel {
  constructor(json) {
    console.log('json image',json);
    this.full = json?.full?.url ?? 'unknown';
    this.thump = json?.thumb?.url ?? 'unknown';
    this.alt = json?.alt ?? 'N/a';
  }
}
