import {StatusBar, StyleSheet, Platform} from 'react-native';


export default styles = {
  statusBarColor: "rgba(0,0,0, 0.3)",

  container: {
    backgroundColor: "#d5dae4"
  },

  selectionColor: "#a23737",

  header : {
    backgroundColor: "#eaeef7"
  },

  headerTitle: {
    fontSize: 16,
    color: "#a9b3c7"
  },

  headerIcon: {
    color: "#a9b3c7",
    fontSize: 24
  },

  headerSaveIcon: {
    color: "#a23737",
    fontSize: 24
  },

  modalHeader: {
    backgroundColor: "#eaeef7"
  },

  content: {
    padding: 10
  },

  block: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },

  blockHeading: {
    fontWeight: "bold",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d5dae4",
    paddingTop: 5,
    paddingBottom: 15
  },

  primaryButton: {
    backgroundColor: "#a23737",
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12
  },

  grayButton: {
    backgroundColor: "#eaeef7",
    paddingLeft: 15,
    paddingRight: 15
  },
  grayButtonText: {
    fontWeight: "bold",
    color: "#a9b3c7",
    fontSize: 12
  },

  pickerWrapper: {
    marginBottom: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d6d7da"
  },

  pickerDisabled: {
    color: "#d6d7da"
  },

  footerButton : {
    backgroundColor: "#a23737",
    borderRadius: 0,
    height: 60
  },

  footerButtonActive : {
    backgroundColor: "#903131",
    borderRadius: 0,
    height: 60
  },

  footerBadge: {
    color: "#fff",
    marginBottom: 1
  },

  itemInput: {
    marginLeft: 0,
    marginBottom: 15,
    borderBottomColor: "#d6d7da",
    borderBottomWidth: StyleSheet.hairlineWidth
  },

  textNote: {
    fontSize: 12,
    color: "#9c9c9c"
  },

  p: {
    lineHeight: 21,
    marginBottom: 10
  }
}

if (Platform.OS === 'android') {
  styles.header = {
      backgroundColor: "#eaeef7",
      paddingTop:  StatusBar.currentHeight ,
      height:  80
  }
}