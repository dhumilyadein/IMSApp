export default {
  items: [

    {
      name: 'Admin Dashboard',
      url: 'admin/dashboard',
      icon: 'icon-speedometer',

    },

    {
      name: 'Manage Users',
      url: '/manageUsers',
      icon: 'icon-people',
      children: [
        {
          name: 'Register Users',
          url: '/admin/registerUser',
          icon: 'icon-user-follow',
          variant: 'success',
        },
        {
          name: 'Search Users',
          url: '/admin/searchUser',
          icon: 'icon-magnifier',
          variant: 'success',
        },
        {
          name: 'Users',
          url: '/admin/users',
          icon: 'icon-magnifier',
          variant: 'success',
        },
        {
          name: 'User Details',
          url: '/admin/userDetails',
          icon: 'icon-user-follow',
          variant: 'success',
        },
        {
          name: 'Import Users',
          url: '/admin/importUser',
          icon: 'icon-people',
          variant: 'success',
        },
    ]},

      
    {
      divider: true,
    },



    {
      name: 'Manage Fees',
      url: '/finance',
      icon: 'fa fa-money',
      children: [
        {
          name: 'Add Fees',
          url: '/admin/finance/AddFees',
          icon: 'fa fa-money',
          variant: 'primary',
        },
        {
          name: 'View Fees',
          url: '/admin/finance/ViewFees',
          icon: 'fa fa-money',
          variant: 'primary',
        },
        {
          name: 'Fee Templates ',
          url: '/admin/finance/FeeTemplates',
          icon: 'fa fa-money',
          variant: 'primary',
        },
    ]},


       {
      divider: true,
    },

    {
      name: 'Manage Inventory',
      url: '/inventory',
      icon: 'icon-basket-loaded',
     
      children: [
        {
          name: 'Add Items',
          url: '/admin/inventory/AddItems',
          icon: 'icon-bag',
          variant: 'success',
        },
        {
          name: 'View/Edit Items',
          url: '/admin/inventory/ViewItems',
          icon: 'icon-basket-loaded',
          variant: 'success',
        }]},


  
   

    {
      divider: true,
    },










  ],
};
