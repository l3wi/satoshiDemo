const prod = process.env.NODE_ENV === 'production'

export default  {
    API: prod
      ? 'https://iotapay-server.now.sh/'
      : 'http://localhost:9000/',
      ADDRESS: `GQMHDLS9XPSNURUCPKKJJTULZRPH9WSKUKQQQPJOY9CPRCNAUSIFWCLHVDSUHJJCPMQDARUIFFXKXFVQD`,
      IOTA: prod
      ? 'https://node.tangle.works'
      : 'http://52.58.212.188:14700',
  }