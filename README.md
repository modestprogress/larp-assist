# LARP Assist (larp-assist)

LARP Assist

## Best Practices 

When coding in Vue, use this API https://vuejs.org/guide/extras/composition-api-faq.html

### Directory structure

#### src/components/{player,gm,common}

Components are organized as such:

user 
./player - Components players use to view and interact with the world
./gm - The components used by GMs manage the game
./common - Common UI components

### src/stores/

This is where the Pinia stores are found. Pinia is a Store for Vue.
It's responsible for managing state of business objects.


###

Web (Pinia stores) -  We are backing our Pinia stores with Firestore's api, which lets you interact with the database/document store directly from a web client, simplifying things tremendously. Firestore's security rules match on the currently authorized user.are flexible enough to 

Google Cloud Functions - This is for mutation of state that needs to be regulated for safety reasons.  For example, when a player buys something in the market, they need to have write access to their balance and whatever is tracking the item. This is a complete mess to protect with firestore rules alone


## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

