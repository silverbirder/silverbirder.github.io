import { rocketLaunch } from '@rocket/launch';
import { rocketBlog } from '@rocket/blog';
import { rocketSearch } from '@rocket/search';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';

export default {
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  presets: [
    rocketLaunch(), 
    rocketBlog(), 
    rocketSearch(),
  ],
};
