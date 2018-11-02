export default {
  items: [

    {
      name: 'Admin Dashboard',
      url: 'admin/dashboard',
      icon: 'icon-speedometer',

    },

    {
      title: true,
      name: 'Manage Profiles',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Register Profiles',
      url: '/admin/registerUser',
      icon: 'icon-user-follow',
    },
    {
      name: 'Search Profiles',
      url: '/admin/searchUser',
      icon: 'icon-magnifier',
    },



       {
      divider: true,
    },
  ],
};
