export default {
  items: [
    {
      name: 'Admin Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: '',
      },
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
      name: 'Register User',
      url: '/register',
      icon: 'icon-user-follow'
      ,
    },
    {
      name: 'Search User',
      url: '/manage-users/search',
      icon: 'icon-magnifier'
    },

    {
      title: true,
      name: 'Manage Finance',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Fees Management 1',
      url: '/manage-finance/fees',
      icon: 'icon-paper-plane',
          },
    {
      name: 'Fees Management 2',
      url: '/manage-finance/fees',
      icon: 'icon-paper-plane',

            },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Manage Attendance',
    },
    {
      name: 'Attendance 1',
      url: '/Attendance',
      icon: 'icon-people',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star',
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star',
        },
      ],
    },

  ],
};
