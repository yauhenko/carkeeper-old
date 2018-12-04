import {StatusBar} from 'react-native';


export default styles = {
  statusBarColor: "rgba(0,0,0, 0.3)",

  selectionColor: "#a23737",

  header : {
    backgroundColor: "#555",
    paddingTop: StatusBar.currentHeight,
    height: 80,
  },

  headerTitle: {
    fontSize: 16
  },

  modalHeader: {
    backgroundColor: "#555"
  },

  container: {
    backgroundColor: '#fff',
  },

  primaryButton: {
    backgroundColor: "#f13f3f"
  },

  primaryButtonText: {
    color: "#fff"
  },

  pickerWrapper: {
    marginBottom: 5,
    borderBottomWidth: 0.3,
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
    borderBottomWidth: 0.5
  },

  textNote: {
    fontSize: 12,
    color: "#b9babd"
  }
}