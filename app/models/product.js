import ImageModel from './image';
import CategoryModel from './category';
import LocationModel from './location';
import UserModel from './user';
import OpenTimeModel from './open_time';

export default class ProductModel {
  constructor(json) {
    this.id = json?.ID?.toString();
    this.title = json?.post_title;
    this.author = json?.author ? new UserModel(json?.author) : null;
    this.image = json?.image ? new ImageModel(json?.image) : null;
    this.category = json?.category ? new CategoryModel(json?.category) : null;
    this.createDate = json?.post_date;
    this.dateEstablish = json?.date_establish;
    this.rate = json?.rating_avg;
    this.numRate = json?.rating_count;
    this.rateText = json?.post_status;
    this.status = json?.cf_status;
    this.favorite = json?.wishlist;
    this.address = json?.address;
    this.phone = json?.phone;
    this.fax = json?.fax;
    this.email = json?.email;
    this.website = json?.website;
    this.description = json?.post_excerpt;
    this.priceMin = json?.price_min;
    this.priceMax = json?.price_max;
    this.link = json?.guid;
    this.cf_360_images = json?.cf_360_images;
    this.cf_hinh_thuc = json?.cf_hinh_thuc;
    this.cf_thoi_han = json?.cf_thoi_han;
    this.cf_size = json?.cf_size;
    this.cf_sigh = json?.cf_sigh;
    this.cf_mat_do = json?.cf_mat_do;
    this.cf_light_system = json?.cf_light_system;
    this.cf_status = json?.cf_status;
    this.cf_price = json?.cf_price;
    this.cf_don_gia = json?.cf_don_gia;
    this.cf_price_exclude = json?.cf_price_exclude;
    this.cf_city = json?.cf_city;
    this.openTime = json?.opening_hour?.map?.((item) => {
      return new OpenTimeModel(item);
    });
    this.gallery = json?.galleries?.map?.((item) => {
      return new ImageModel(item);
    });
    this.features = json?.features?.map?.((item) => {
      return new CategoryModel(item);
    });
    this.related = json?.related?.map?.((item) => {
      return new ProductModel(item);
    });
    this.lastest = json?.lastest?.map?.((item) => {
      return new ProductModel(item);
    });
    this.location = new LocationModel({
      name: json?.post_title,
      latitude: json?.latitude,
      longitude: json?.longitude,
    });
  }
}
