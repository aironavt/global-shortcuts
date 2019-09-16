/**
 * Allows you to remove the QUOTA_BYTES_PER_ITEM restriction, leaving only BYTES_PER_ITEM
 */
export default class Storage {
  _data = {};

  /**
   * The maximum total amount (in bytes) of data that can be stored in sync storage
   * https://developer.chrome.com/extensions/storage#properties
   * @type {number}
   */
  static QUOTA_BYTES = 102400;

  /**
   * The maximum size (in bytes) of each individual item in sync storage
   * https://developer.chrome.com/extensions/storage#properties
   * @type {number}
   */
  static QUOTA_BYTES_PER_ITEM = 8192;

  /**
   * Unique prefix for keys
   * @type {string}
   */
  static ITEM_KEY_PREFIX = 'p';

  static getRegexKey() {
    return new RegExp(`^${Storage.ITEM_KEY_PREFIX}\\d+$`);
  }

  constructor() {
    chrome.storage.sync.onChanged.addListener(this._applyChanges.bind(this));
  }

  /**
   * Splits a string into pieces no more than QUOTA_BYTES_PER_ITEM bytes
   * @param string
   * @returns {Array<string>}
   * @private
   */
  _split(string) {
    // The maximum number of pieces into which a string can be divided
    const maximumNumberOfParts = Math.ceil(Storage.QUOTA_BYTES / Storage.QUOTA_BYTES_PER_ITEM);
    // The size of the split string in bytes. We use the JSON.stringify method,
    // since it is in this form that Chrome will later store data.
    const stringSize = Storage._getSizeInBytes(JSON.stringify(string));
    // Get the maximum key size in bytes
    const reservedSize = Storage._getSizeInBytes(
      `${Storage.ITEM_KEY_PREFIX}${maximumNumberOfParts}`,
    );

    // If the saved data does not fit into the storage
    if ((stringSize + (reservedSize * maximumNumberOfParts)) > Storage.QUOTA_BYTES) {
      // TODO: error
    }

    // If the total size of the entire row and its key size is less
    // than the maximum available size of a single storage item
    if ((stringSize + reservedSize) < Storage.QUOTA_BYTES_PER_ITEM) {
      // Insert the whole string, no need to split it
      return [string];
    }

    // Maximum available size for one chunk
    const chunkSize = Storage.QUOTA_BYTES_PER_ITEM - reservedSize;

    // Offset from the beginning of the line
    let offset = 0;
    const chunks = [];

    for (let step = 0; step < maximumNumberOfParts; step++) {
      let currentChunkSize = chunkSize;
      const position = offset + currentChunkSize;
      let newChunk = string.slice(offset, position);
      let newChunkSize = Storage._getSizeInBytes(JSON.stringify(newChunk));

      // Reduce the chunk until it fits the maximum available value
      while (newChunkSize > chunkSize) {
        currentChunkSize--;

        newChunk = string.slice(offset, offset + currentChunkSize);
        newChunkSize = Storage._getSizeInBytes(JSON.stringify(newChunk));
      }

      chunks.push(newChunk);
      offset += currentChunkSize;

      if (offset >= stringSize) {
        break;
      }
    }

    return chunks;
  }

  /**
   * Returns the string size in bytes
   * @param {string} string
   * @returns {number}
   * @private
   */
  static _getSizeInBytes(string) {
    return new TextEncoder('utf-8').encode(string).length;
  }

  _getIds() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        const Ids = [];

        Object.keys(items).forEach((index) => {
          if (index.match(Storage.getRegexKey()) !== null) {
            Ids.push(index);
          }
        });

        resolve(Ids);
      });
    });
  }

  _updateDate(addedItems, removeItems) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(addedItems, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        if (removeItems.length > 0) {
          chrome.storage.sync.remove(removeItems, () => {
            if (chrome.runtime.lastError) {
              return reject(chrome.runtime.lastError);
            }

            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  async _applyChanges() {
    this._data = await this.fetch();
  }

  /**
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async set(options) {
    const Ids = await this._getIds();
    const items = {};
    let chunks = [];

    try {
      chunks = this._split(JSON.stringify(options));
    } catch (error) {
      throw new Error(error);
    }

    chunks.forEach((item, index) => {
      const id = `${Storage.ITEM_KEY_PREFIX}${index}`;
      items[id] = item;

      const idPosition = Ids.indexOf(id);

      if (idPosition !== -1) {
        Ids.splice(idPosition, 1);
      }
    });

    await this._updateDate(items, Ids);

    this._data = options;
  }

  get() {
    return this._data;
  }

  /**
   * Retrieves all data from storage
   * @returns {Promise<Object>}
   */
  fetch() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(null, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        let string = '';

        Object.keys(items).forEach((index) => {
          if (index.match(Storage.getRegexKey()) !== null) {
            string += items[index];
          }
        });

        if (string === '') {
          resolve({});
        }

        try {
          this._data = JSON.parse(string);

          resolve(this._data);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
