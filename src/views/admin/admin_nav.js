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
          variant: 'success',
        },
        {
          name: 'View Fees',
          url: '/admin/finance/ViewFees',
          icon: 'fa fa-money',
          variant: 'success',
        },
        {
          name: 'Fee Templates ',
          url: '/admin/finance/FeeTemplates',
          icon: 'fa fa-money',
          variant: 'success',
        },
    ]},


       {
      divider: true,
    },
    {
      name: 'Manage Library',
      url: '/library',
      icon: 'icon-basket-loaded',

      children: [
        {
          name: 'Add Book',
          url: '/admin/library/AddBook',
          icon: 'icon-bag',
          variant: 'success',
        },
        {
          name: 'Import Bulk Books',
          url: '/admin/library/ImportBulkBooks',
          icon: 'icon-bag',
          variant: 'success',
        },
        {
          name: 'Issue Books',
          url: '/admin/library/IssueBooks',
          icon: 'icon-basket-loaded',
          variant: 'success',
        },
        {
          name: 'Return Books',
          url: '/admin/library/ReturnBooks',
          icon: 'icon-basket-loaded',
          variant: 'success',
        },
        {
          name: 'Search/Edit Books',
          url: '/admin/library/SearchBooks',
          icon: 'icon-basket-loaded',
          variant: 'success',
        }
      ]},
    {
      name: 'Manage Inventory',
      url: '/inventory',
      icon: 'icon-basket-loaded',

      children: [
        {
          name: 'Create Items',
          url: '/admin/inventory/CreateItems',
          icon: 'icon-bag',
          variant: 'success',
        },
        {
          name: 'Add Items',
          url: '/admin/inventory/AddItems',
          icon: 'icon-bag',
          variant: 'success',
        },
        {
          name: 'Consume Items',
          url: '/admin/inventory/ConsumeItems',
          icon: 'icon-basket-loaded',
          variant: 'success',
        },
        {
          name: 'History',
          url: '/admin/inventory/ItemHistory',
          icon: 'icon-basket-loaded',
          variant: 'success',
        }
      ]},

        {
          name: 'Class Management',
          url: '/classmanagement',
          icon: 'icon-briefcase',
    
          children: [
            {
              name: 'Class Details',
              url: '/admin/classmanagement/ClassDetails',
              icon: 'icon-bag',
              variant: 'success',
            },
            {
              name: 'Notifications',
              url: '/admin/classmanagement/Notifications',
              icon: 'icon-bell',
              variant: 'success',
            },
            {
              name: 'Send mail/message',
              url: '/admin/classmanagement/sendMail',
              icon: 'icon-phone',
              variant: 'success',
            },
            {
              name: 'Add Fee template',
              url: '/admin/classmanagement/AddFeeTemplate',
              icon: 'icon-bag',
              variant: 'success',
            },
            {
              name: 'Schedule PT Meet',
              url: '/admin/classmanagement/SchedulePTMeet',
              icon: 'icon-calendar',
              variant: 'success',
            },
            {
              name: 'Promote Class',
              url: '/admin/classmanagement/PromoteClass',
              icon: 'icon-plus',
              variant: 'success',
            },
          ]},



    {
      divider: true,
    },










  ],
};
