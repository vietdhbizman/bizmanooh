import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  lineSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateLine: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  contentInforAction: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  lineWorkHours: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  contentDescription: {
    marginHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
  },
  viewer: {
    height: 480,
  },
  contentPickDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 10
  },
  itemPick: {
    flex: 1,
    justifyContent: "center"
  },
  linePick: {
    width: 1,
    marginRight: 10
  },
  contentCalendar: {
    borderRadius: 8,
    width: "100%"
  },
  contentActionCalendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15
  },
  iconLocation: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
