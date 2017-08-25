importScripts('flash.js', 'api.js');

const multisig = Flash.multisig;

// TODO: Compile this with babel
onmessage = async (e) => {
  
  const state = e.data[0];
  const userID = e.data[1];

  // Get a new digest
  // Fetch new multisig addresses
  // consists of { root, remainder }
  const digests = [];
  for (let i = 0; i < treeDepth + 1; i++) {
    const digest = await getNewDigest(state);
    digests.push(digest);
  }
  const addresses = await registerChannel(digests, e.data[2]);
  
  // Update state
  state.flash.remainderAddress = addresses.remainder;
  state.flash.root = addresses.root;
  postMessage([state]);
}

async function getNewDigest(state) {

  // Create new digest
  const digest = multisig.getDigest(
    state.userSeed,
    state.index,
    state.security
  );

  // Increment digests key index
  state.index++;
  state.init = true

  return digest;
}

async function registerChannel(digests, userID) {
  console.log('Address Digests: ', digests)

  const opts = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      id: userID,
      digests: digests
    })
  }
  console.log(opts)
  // Send digests to server and obtain new multisig addresses
  const response = await utils.API("register", opts)

  console.log('Server Digests: ', response)
  const serverDigests = response.digests;
  let multisigs = digests.map((digest, index) => {      
    let addy = multisig.composeAddress([digest, serverDigests[index]]);
    addy.index = digest.index;
    addy.securitySum = digest.security + serverDigests[index].security; // flash sums security level ?
    addy.security = digest.security;
    return addy;
  });
    
  const remainderAddress = multisigs.shift();

  for(let i = 1; i < multisigs.length; i++) {
    multisigs[i-1].children.push(multisigs[i]);
  }
  console.log(multisigs[0]);
  //console.log(iota.utils.addChecksum(multisigs[0].address))
    
  return {
    remainderAddress: remainder,
    root: multisigs.shift()
  };
}
