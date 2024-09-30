import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AsyncStorageHelpers {
  static async setItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static async getItem(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
