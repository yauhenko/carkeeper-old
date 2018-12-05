import {StatusBar, StyleSheet} from 'react-native';


export default styles = {
  statusBarColor: "rgba(0,0,0, 0.3)",

  container: {
    backgroundColor: "#d5dae4"
  },

  selectionColor: "#a23737",

  header : {
    backgroundColor: "#eaeef7",
    paddingTop: StatusBar.currentHeight,
    height: 80,
  },

  headerTitle: {
    fontSize: 16,
    color: "#a9b3c7"
  },

  headerIcon: {
    color: "#a9b3c7"
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

  primaryButton: {
    backgroundColor: "#f13f3f"
  },

  primaryButtonText: {
    color: "#fff"
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
    backgroundColor: "#555",
    borderRadius: 0,
    height: 60
  },

  footerButtonActive : {
    backgroundColor: "#333",
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
    color: "#b9babd"
  }
}