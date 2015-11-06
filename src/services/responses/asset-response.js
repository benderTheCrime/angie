/**
 * @module asset-response.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/16/2015
 */

/**
 * @desc AssetResponse defines any Angie response that has a path which can be
 * mapped to a path in the Angie `staticDir`s which could not be routed via a
 * controller. It is responsible for serving the asset response and setting up
 * the headers associated with the served asset.
 * @since 0.4.0
 * @access private
 * @extends {BaseResponse}
 */
class AssetResponse extends BaseResponse {
    constructor() {
        super();

        // Set the content type based on the asset path
        this.path = $Injector.get('$request').path;
    }

    /**
     * @desc Sets up the headers associated with the AssetResponse
     * @since 0.4.0
     * @access private
     */
    head() {
        return super.head();
    }

    /**
     * @desc Finds the asset and writes it to the response.
     * @since 0.4.0
     * @access private
     */
    write() {
        let assetCache = new $CacheFactory('staticAssets'),
            asset = this.response.content =
                assetCache.get(this.path) ||
                    $$templateLoader(this.path, 'static'),
            me = this;
        return new Promise(function(resolve) {
            if (asset) {
                me.response.write(asset);
            } else {
                return new UnknownResponse().head().write();
            }
            resolve();
        });
    }

    /**
     * @desc Determines whether or not the response has an asset to which it can
     * be associated.
     * @param {string} path The relative url of the asset path from the
     * AngieFile.json staticDirs
     * @returns {boolean} Does the relative staticDirs path exist
     * @since 0.4.0
     * @access private
     */
    static $isRoutedAssetResourceResponse(path) {
        let foundAssetPath = false;

        for (let dir of $Injector.get('ANGIE_STATIC_DIRS')) {
            if (!!$FileUtil.find(dir, path)) {
                foundAssetPath = true;
                break;
            }
        }

        return foundAssetPath;
    }
}

export default AssetResponse;