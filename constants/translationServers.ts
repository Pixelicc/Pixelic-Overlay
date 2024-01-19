export default {
  MOJANG: {
    props: {
      ID: "MOJANG",
      title: "Mojang",
      subtitle: "Official",
    },
    URLs: {
      UUID: "https://api.mojang.com/users/profiles/minecraft/{USERNAME}",
      username: "https://api.mojang.com/user/profile/{UUID}",
    },
    paths: {
      UUID: "$.id",
      username: "$.name",
    },
  },
  MOWOJANG: {
    props: {
      ID: "MOWOJANG",
      title: "Mowojang",
      subtitle: "3rd Party",
    },
    URLs: {
      UUID: "https://mowojang.matdoes.dev/{USERNAME}",
      username: "https://mowojang.matdoes.dev/{UUID}",
    },
    paths: {
      UUID: "$.id",
      username: "$.name",
    },
  },
  PLAYERDB: {
    props: {
      ID: "PLAYERDB",
      title: "PlayerDB",
      subtitle: "3rd Party",
    },
    URLs: {
      UUID: "https://playerdb.co/api/player/minecraft/{USERNAME}",
      username: "https://playerdb.co/api/player/minecraft/{UUID}",
    },
    paths: {
      UUID: "$.data.player.id",
      username: "$.data.player.username",
    },
  },
  ASHCON: {
    props: {
      ID: "ASHCON",
      title: "Ashcon",
      subtitle: "3rd Party",
    },
    URLs: {
      UUID: "https://api.ashcon.app/mojang/v2/user/{USERNAME}",
      username: "https://api.ashcon.app/mojang/v2/user/{UUID}",
    },
    paths: {
      UUID: "$.uuid",
      username: "$.username",
    },
  },
  CUSTOM: {
    props: {
      ID: "CUSTOM",
      title: "Custom",
      subtitle: "Your own Translation Server",
    },
  },
};