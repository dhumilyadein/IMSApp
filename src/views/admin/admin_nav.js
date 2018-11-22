export default {
  items: [

    {
      name: 'Admin Dashboard',
      url: 'admin/dashboard',
      icon: 'icon-speedometer',

    },

    {
      title: true,
      name: 'Manage Users',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Register Users',
      url: '/admin/registerUser',
      icon: 'icon-user-follow',
    },
    {
      name: 'Search Users',
      url: '/admin/searchUser',
      icon: 'icon-magnifier',
    },
    {
      name: 'Import Users',
      url: '/admin/importUser',
      icon: 'icon-people',
    },



       {
      divider: true,
    },


    {
      title: true,
      name: 'Manage Fees',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Add Fees',
      url: '/admin/finance/AddFees',
      icon: 'fa fa-money',
    },
    {
      name: 'Fees Status ',
      url: '/admin/finance/FeesView',
      icon: 'fa fa-money',
    },



       {
      divider: true,
    },
  
  ],
};
