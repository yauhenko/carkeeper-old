import LogHub from "loghub-pro";
import {Platform} from "react-native";

const Logger = new LogHub('z9ndbJ0plUvDwkPOV3WyqRxNmctDflPV4J8jMg9b', 'CarKeeper', {
  platform: Platform.OS,
  platformVersion: Platform.Version,
  version: "1.3"
});

export default Logger;