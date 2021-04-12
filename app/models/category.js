import ImageModel from './image';

export default class CategoryModel {
  constructor(json) {
    this.id = json?.term_id;
    this.title = json?.name;
    this.count = json?.count;
    this.image = json?.image ? new ImageModel(json?.image) : null;
    this.icon = json?.icon;
    this.color = json?.color;
    this.type = this.exportType(json?.taxonomy);
  }

  exportType(type) {
    switch (type) {
      case 'product_feature':
        return 'feature';
      case 'product_location':
        return 'location';
      default:
        return 'category';
    }
  }
}
