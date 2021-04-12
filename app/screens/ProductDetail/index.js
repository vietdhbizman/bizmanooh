import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import {BaseColor, useTheme, BaseStyle} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Tag,
  Image,
  ListItem,
  Card
} from '@components';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import {useTranslation} from 'react-i18next';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Modal from 'react-native-modal';
import * as Utils from '@utils';
import {useDispatch, useSelector} from 'react-redux';
import {productActions, wishListActions} from '@actions';
import {userSelect} from '@selectors';
import styles from './styles';
import PanoramaView from "@lightbase/react-native-panorama-view";

export default function ProductDetail({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const id = route.params?.id;
  const user = useSelector(userSelect);
  const deltaY = new Animated.Value(0);
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(null);
  const [product, setProduct] = useState(null);
  const [collapseHour, setCollapseHour] = useState(false);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  useEffect(() => {
    loadData();
  }, []);

  /**
   * on loaddata
   *
   */
  const loadData = () => {
    dispatch(
      productActions.onLoadProduct({id}, (item) => {
        setLoading(false);
        setProduct(item);
        setLike(item.favorite);
      }),
    );
  };

  /**
   * like action
   * @param {*} like
   */
  const onLike = (like) => {
    if (user) {
      setLike(null);
      dispatch(
        wishListActions.onSave({post_id: id}, like, () => {
          route.params?.onLike?.(like);
          setLike(like);
        }),
      );
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            setLike(null);
            dispatch(
              wishListActions.onSave({post_id: id}, like, () => {
                route.params?.onLike?.(like);
                setLike(like);
              }),
            );
          },
        },
      });
    }
  };

  /**
   * on Review action
   */
  const onReview = () => {
    const params = {
      ...route.params,
      reload: loadData,
    };
    if (user) {
      navigation.navigate({
        name: 'Review',
        params,
      });
    } else {
      navigation.navigate({
        name: 'SignIn',
        params: {
          success: () => {
            navigation.navigate({
              name: 'Review',
              params,
            });
          },
        },
      });
    }
  };

  /**
   * go product detail
   * @param {*} item
   */
  const onProductDetail = (item) => {
    navigation.navigate({
      name: 'ProductDetail',
      params: {
        id: item.id,
        onLike: (favorite) => {
          item.favorite = favorite;
          dispatch(wishListActions.onUpdate(item));
        },
      },
      key: Date.now().toString(),
    });
  };

  /**
   * Open action
   * @param {*} item
   */
  const onOpen = (type, title, link) => {
    Alert.alert({
      title: title,
      message: `${t('do_you_want_open')} ${title} ?`,
      action: [
        {
          text: t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('done'),
          onPress: () => {
            switch (type) {
              case 'web':
                Linking.openURL(link);
                break;
              case 'phone':
                Linking.openURL('tel://' + link);
                break;
              case 'email':
                Linking.openURL('mailto:' + link);
                break;
              case 'address':
                Linking.openURL(link);
                break;
            }
          },
        },
      ],
    });
  };

  /**
   * collapse open time
   */
  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  /**
   * render wishlist status
   *
   */
  const renderWishList = () => {
    if (like == null) {
      return <ActivityIndicator size="small" color={colors.primary} />;
    }
    return (
      <TouchableOpacity onPress={() => onLike(!like)}>
        {like ? (
          <Icon name="heart" color={colors.primaryLight} solid size={18} />
        ) : (
          <Icon name="heart" color={colors.primaryLight} size={18} />
        )}
      </TouchableOpacity>
    );
  };
  const renderModal = () => {
    if(!product?.cf_360_images){
      return (
        <Modal
          isVisible={modalVisible}
          backdropColor="rgba(0, 0, 0, 0.5)"
          backdropOpacity={1}
          animationIn="fadeIn"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}>
          
            <View
              style={[styles.contentCalendar, {backgroundColor: colors.card}]}>
              <View style={styles.contentActionCalendar}>
                  <Text body1 primaryColor>
                    Sản phẩm hiện không có ảnh 360
                  </Text>
              </View>
              <View style={styles.contentActionCalendar}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Text body1 primaryColor>
                    {t('done')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          
        </Modal>
      );
    }
    return (
      <Modal
        isVisible={modalVisible}
        backdropColor="rgba(0, 0, 0, 0.5)"
        backdropOpacity={1}
        animationIn="fadeIn"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        
          <View
            style={[styles.contentCalendar, {backgroundColor: colors.card}]}>
                {product?.cf_360_images && (
                  <PanoramaView
                    style={styles.viewer}
                    dimensions={{ height: 480, width: Dimensions.get("window").width }}
                    inputType="mono"
                    enableTouchTracking={true}
                    imageUrl={product.cf_360_images}
                  />
                )}
            <View style={styles.contentActionCalendar}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Text body1 primaryColor>
                  {t('done')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        
      </Modal>
    );
  }
  /**
   * render Banner
   * @returns
   */
  const renderBanner = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <Animated.View
            style={[
              styles.imgBanner,
              {
                height: deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [heightImageBanner, heightHeader, heightHeader],
                }),
              },
            ]}>
            <PlaceholderMedia style={{width: '100%', height: '100%'}} />
          </Animated.View>
        </Placeholder>
      );
    }

    return (
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Image source={{uri: product?.image?.full}} style={{flex: 1}} />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 15,
            left: 20,
            flexDirection: 'row',
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}>
          <Image
            source={{uri: product?.author?.image}}
            style={styles.userIcon}
          />
          <View>
            <Text headline semibold whiteColor>
              {product?.author?.name}
            </Text>
            <Text footnote whiteColor>
              {product?.author?.email}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  /**
   * render Content View
   * @returns
   */
  const renderContent = () => {
    if (loading) {
      return (
        <ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {y: deltaY},
                },
              },
            ],
            {useNativeDriver: false},
          )}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          <View style={{height: 255 - heightHeader}} />
          <Placeholder Animation={Progressive}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              <PlaceholderLine style={{width: '50%', marginTop: 10}} />
              <PlaceholderLine style={{width: '70%'}} />
              <PlaceholderLine style={{width: '40%'}} />
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <View style={styles.line}>
                <PlaceholderMedia style={styles.contentIcon} />
                <View style={{marginLeft: 10, flex: 1, paddingTop: 10}}>
                  <PlaceholderLine style={{width: '40%'}} />
                </View>
              </View>
              <PlaceholderLine
                style={{width: '100%', height: 250, marginTop: 20}}
              />
            </View>
          </Placeholder>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ],
          {useNativeDriver: false},
        )}
        onContentSizeChange={() => {
          setHeightHeader(Utils.heightHeader());
        }}
        scrollEventThrottle={8}>
        <View style={{height: 255 - heightHeader}} />
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}>
          <View style={styles.lineSpace}>
            <Text title1 semibold style={{paddingRight: 15}}>
              {product?.title}
            </Text>
            {/* {renderWishList()} */}
          </View>
          <View style={styles.lineSpace}>
            <View>
              <Text caption1 primaryColor>
                {product?.category?.title}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const location = `${product?.location?.latitude},${product?.location?.longitude}`;
                  const url = Platform.select({
                    ios: `maps:${location}`,
                    android: `geo:${location}?center=${location}&q=${location}&z=16`,
                  });
                  onOpen('address', t('address'), url);
                }}>
                <Tag rateSmall style={{marginRight: 5}} onPress={onReview}>
                  {product?.cf_city}
                </Tag>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.rateLine} onPress={onReview}>
                <Tag rateSmall style={{marginRight: 5}} onPress={onReview}>
                  {product?.rate}
                </Tag>
                <StarRating
                  disabled={true}
                  starSize={10}
                  maxStars={5}
                  rating={product?.rate}
                  fullStarColor={BaseColor.yellowColor}
                  on
                />
                <Text footnote primaryColor style={{marginLeft: 5}}>
                  ({product?.numRate})
                </Text>
              </TouchableOpacity> */}
            </View>
            <Tag status>{product?.cf_status}</Tag>
          </View>
          {/* <TouchableOpacity
            style={styles.line}
            onPress={() => {
              const location = `${product?.location?.latitude},${product?.location?.longitude}`;
              const url = Platform.select({
                ios: `maps:${location}`,
                android: `geo:${location}?center=${location}&q=${location}&z=16`,
              });
              onOpen('address', t('address'), url);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon
                name="map-marker-alt"
                size={16}
                color={BaseColor.whiteColor}
              />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 primaryColor>
                {t('address')}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {product?.cf_city}
              </Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.line}
            onPress={() => openModal()}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="globe" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text caption2 primaryColor>
                {'360'}
              </Text>
              <Text footnote semibold style={{marginTop: 5}}>
                {'Ảnh Panorama'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('image_file_chao', t('image_file_chao'), product?.phone);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="image" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              {/* <Text caption2 primaryColor>
                {t('image_file_chao')}
              </Text> */}
              <Text footnote semibold style={{marginTop: 5}}>
                {/* {product?.phone} */}
                {t('image_file_chao')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('video', t('video'), product?.email);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="video" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              {/* <Text caption2 primaryColor>
                {t('video')}
              </Text> */}
              <Text footnote semibold style={{marginTop: 5}}>
                {/* {product?.email} */}
                {t('video')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.line}
            onPress={() => {
              onOpen('file', t('file-chao'), product?.website);
            }}>
            <View
              style={[styles.contentIcon, {backgroundColor: colors.border}]}>
              <Icon name="file-pdf" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={{marginLeft: 10}}>
              {/* <Text caption2 primaryColor>
                {t('website')}
              </Text> */}
              <Text footnote semibold style={{marginTop: 5}}>
                {/* {product?.website} */}
                {t('file-chao')}
              </Text>
            </View>
          </TouchableOpacity>
         
        </View>
        <View style={[styles.contentDescription, {borderColor: colors.border}]}>
          <Text body2 style={{lineHeight: 20}}>
            {product?.description}
          </Text>
          <View
            style={{
              paddingVertical: 20,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <Text caption1 primaryColor>
                {/* {t('date_established')} */}
              </Text>
              <Text headline style={{marginTop: 5}}>
                {product?.dateEstablish}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text caption1 primaryColor>
                {t('price_range')}
              </Text>
              <Text headline style={{marginTop: 5}}>
                {`${product?.priceMin ?? '-'}$ - ${product?.priceMax ?? '-'}$`}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 180,
              paddingVertical: 20,
            }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: parseFloat(product?.location?.latitude ?? 0.0),
                longitude: parseFloat(product?.location?.longitude ?? 0.0),
                latitudeDelta: 0.009,
                longitudeDelta: 0.004,
              }}
              mapType='hybrid'
              >
              <Marker
                coordinate={{
                  latitude: parseFloat(product?.location?.latitude ?? 0.0),
                  longitude: parseFloat(product?.location?.longitude ?? 0.0),
                }}
              >
                <View style={styles.iconLocation} >
                    <Card
                    image={product?.category.image?.full}
                    >
                    </Card>
                  {/* <Icon
                    name="star"
                    size={16}
                    color={
                      index == active ? BaseColor.whiteColor : colors.primary
                    }
                  /> */}
                </View>
              </Marker>
            </MapView>
          </View>
        </View>
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingBottom: 5,
            paddingTop: 15,
          }}>
          {/* {t('facilities')} */}
          {t('thong_so')}
        </Text>
        <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 5,
              // overflow: 'auto',
            }}>
          {!!product?.cf_hinh_thuc && (
          <View
            style={[styles.lineWorkHours, {borderColor: colors.border}]}
          >
            <Text body2 primaryColor>
              {t('hinh_thuc')}
            </Text>
            <Text body2 accentColor semibold style={{maxWidth: '50%'}}>
              {t(product?.cf_hinh_thuc)}
            </Text>
          </View>
          )}
          {!!product?.cf_size && (
          <View
            style={[styles.lineWorkHours, {borderColor: colors.border}]}
          >
            <Text body2 primaryColor>
              {t('kich_thuoc')}
            </Text>
            <Text body2 accentColor semibold style={{maxWidth: '50%'}}>
              {t(product?.cf_size)}
            </Text>
          </View>
          )}
          {!!product?.cf_sigh && (
            <View
              style={[styles.lineWorkHours, {borderColor: colors.border}]}
            >
              <Text body2 primaryColor>
                {t('tam_nhin')}
              </Text>
              <Text body2 accentColor semibold style={{maxWidth: '50%'}}>
                {t(product?.cf_sigh)}
              </Text>
            </View>
          )}

          {!!product?.cf_mat_do && (
            <View
              style={[styles.lineWorkHours, {borderColor: colors.border}]}
            >
              <Text body2 primaryColor>
                {t('mat_do')}
              </Text>
              <Text body2 accentColor semibold style={{maxWidth: '50%'}}>
                {t(product?.cf_mat_do)}
              </Text>
            </View>
          )}

          {!!product?.cf_light_system && (
            <View
              style={[styles.lineWorkHours, {borderColor: colors.border}]}
            >
              <Text body2 primaryColor>
                {t('light_system')}
              </Text>
              <Text body2 accentColor semibold style={{maxWidth: '50%'}}>
                {t(product?.cf_light_system)}
              </Text>
            </View>
          )}

          {!!product?.cf_price_exclude && (
            <View
              style={[styles.lineWorkHours, {borderColor: colors.border}]}
            >
              <Text body2 primaryColor>
                {t('price_exclude')}
              </Text>
              <Text body2 accentColor semibold style={{maxWidth: '50%'}}>
                {t(product?.cf_price_exclude)}
              </Text>
            </View>
          )}
        </View>
        {/* <View style={[styles.wrapContent, {borderColor: colors.border}]}>
          {product?.features?.map?.((item) => {
            return (
              <Tag
                key={item.id.toString()}
                icon={
                  <Icon
                    name={Utils.iconConvert(item.icon)}
                    size={12}
                    color={colors.accent}
                    solid
                    style={{marginRight: 5}}
                  />
                }
                chip
                style={{
                  marginTop: 8,
                  marginRight: 8,
                }}>
                {item.title}
              </Tag>
            );
          })}
        </View> */}
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
        {t('related')}
        </Text>
        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={product?.related ?? []}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item, index}) => (
            <ListItem
              grid
              image={item.image?.full}
              title={item.title}
              subtitle={item.category?.title}
              location={item.address}
              phone={item.phone}
              rate={item.rate}
              status={item.cf_status}
              rateStatus={item.rateStatus}
              numReviews={item.numReviews}
              favorite={item.favorite}
              onPress={() => onProductDetail(item)}
              onPressTag={onReview}
              style={{
                marginLeft: 15,
                width: Dimensions.get('window').width / 2,
              }}
            />
          )}
        />
        <Text
          title3
          semibold
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          
          {t('featured')}
        </Text>
        <View style={{paddingHorizontal: 20}}>
          {product?.lastest?.map?.((item) => {
            return (
              <ListItem
                key={item.id.toString()}
                small
                image={item.image?.full}
                title={item.title}
                subtitle={item.category?.title}
                rate={item.rate}
                style={{marginBottom: 15}}
                status={item.cf_status}
                onPress={() => onProductDetail(item)}
                onPressTag={onReview}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderBanner()}
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'top', 'left']}>
        <Header
          title=""
          renderLeft={() => {
            return (
              <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
            );
          }}
          renderRight={() => {
            return (
              <Icon name="images" size={20} color={BaseColor.whiteColor} />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            navigation.navigate('PreviewImage', {
              gallery: product?.gallery,
            });
          }}
        />
        {renderContent()}
        {renderModal()}
      </SafeAreaView>
    </View>
  );
}
