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
          name: 'Import Users',
          url: '/admin/importUser',
          icon: 'icon-people',
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
          name: 'Fee Templates ',
          url: '/admin/finance/FeeTemplates',
          icon: 'fa fa-money',
          variant: 'success',
        },

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
       
    ]},


       {
      divider: true,
    },
    {
      name: 'Manage Library',
      url: '/library',
      icon: 'fa fa-book',

      children: [
        {
          name: 'Add Book',
          url: '/admin/library/AddBook',
          icon: 'icon-notebook',
          variant: 'success',
        },
        {
          name: 'Import Bulk Books',
          url: '/admin/library/ImportBulkBooks',
          icon: 'icon-notebook',
          variant: 'success',
        },
        {
          name: 'Issue Books',
          url: '/admin/library/IssueBooks',
          icon: 'icon-book-open',
          variant: 'success',
        },
        {
          name: 'Return Books',
          url: '/admin/library/ReturnBooks',
          icon: 'icon-book-open',
          variant: 'success',
        },
        {
          name: 'Issue/Return Details',
          url: '/admin/library/IssueReturnDetails',
          icon: 'icon-book-open',
          variant: 'success',
        },
        {
          name: 'Search/Edit Books',
          url: '/admin/library/SearchBooks',
          icon: 'icon-book-open',
          variant: 'success',
        },
        {
          name: 'Edit Category',
          url: '/admin/library/EditCategory',
          icon: 'icon-book-open',
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
              name: 'Create Class',
              url: '/admin/classmanagement/CreateClass',
              icon: 'icon-bag',
              variant: 'success',
            },
            {
              name: 'Class Details',
              url: '/admin/classmanagement/ClassDetails',
              icon: 'icon-bag',
              variant: 'success',
            },

            {
              name: 'Attendance',
              url: '/admin/classmanagement/Attendance',
              icon: 'icon-bag',
              variant: 'success',
            },
            {
              name: 'Time Table',
              url: '/admin/classmanagement/ClassTimeTable',
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
              name: 'Class Fee template',
              url: '/admin/classmanagement/ClassFeeTemplate',
              icon: 'icon-bag',
              variant: 'success',
            },
            {
              name: 'Schedule PT Meet',
              url: '/admin/classmanagement/parentteachermeet/ParentTeacherMeet',
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

          {
            name: 'Manage Exams',
            url: '/exams',
            icon: 'icon-basket-loaded',

            children: [
              {
                name: 'Create Exam',
                url: '/admin/exams/CreateExam',
                icon: 'icon-bag',
                variant: 'success',
              },
              {
                name: 'Schedule Exam',
                url: '/admin/exams/ScheduleExam',
                icon: 'icon-bag',
                variant: 'success',
              },
              {
                name: 'Add Result',
                url: '/admin/exams/AddResult',
                icon: 'icon-basket-loaded',
                variant: 'success',
              },
              {
                name: 'View Results',
                url: '/admin/exams/ViewResults',
                icon: 'icon-basket-loaded',
                variant: 'success',
              }
            ]},
            {
              name: 'Manage Transport',
              url: '/exams',
              icon: 'fa fa-bus',
  
              children: [
                {
                  name: 'Manage Vehicles',
                  url: '/admin/transport/ManageVehicles',
                  icon: 'fa fa-bus',
                  variant: 'success',
                },
                {
                  name: 'Manage Stops',
                  url: '/admin/transport/ManageStops',
                  icon: 'fa fa-bus',
                  variant: 'success',
                },
                {
                  name: 'Manage Routes',
                  url: '/admin/transport/ManageRoutes',
                  icon: 'fa fa-bus',
                  variant: 'success',
                },
                {
                  name: 'Assign Students',
                  url: '/admin/transport/AssignStudents',
                  icon: 'fa fa-bus',
                  variant: 'success',
                },
                {
                  name: 'View/Edit Students',
                  url: '/admin/transport/DeleteStudents',
                  icon: 'fa fa-bus',
                  variant: 'success',
                },
              ]},

              {
                name: 'Manage Payroll',
                url: '/finance',
                icon: 'fa fa-money',
                children: [
                  {
                    name: 'Salary Templates ',
                    url: '/admin/payroll/SalaryTemplates',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },

              
                  {
                    name: 'Pay Salary',
                    url: '/admin/payroll/PaySalary',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },
                  {
                    name: 'View Payslip',
                    url: '/admin/payroll/ViewPayslip',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },
              
                  {
                    name: 'Staff Attendance',
                    url: '/admin/payroll/StaffAttendance',
                    icon: 'icon-bag',
                    variant: 'success',
                  },
                 
                  
              ]},

              {
                name: 'Manage Emp Leaves',
                url: '/leaves',
                icon: 'fa fa-money',
                children: [
                  {
                    name: 'Add Leave Types',
                    url: '/admin/leaves/AddLeaveTypes',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },

              
                  {
                    name: 'Apply Leaves',
                    url: '/admin/leaves/ApplyLeave',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },
              
                  {
                    name: 'Approve Leaves',
                    url: '/admin/leaves/ApproveLeave',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },
              
                 
                  {
                    name: 'View Leaves',
                    url: '/admin/leaves/ViewLeave',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },
                 
                  {
                    name: 'Add Holidays',
                    url: '/admin/leaves/AddHoliday',
                    icon: 'fa fa-money',
                    variant: 'success',
                  },
                  
              ]},


    {
      divider: true,
    },










  ],
};
