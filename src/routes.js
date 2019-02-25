import React from "react";
import Loadable from "react-loadable";

import DefaultLayout from "./containers/DefaultLayout";

function Loading() {
  return <div>Loading...</div>;
}

const Breadcrumbs = Loadable({
  loader: () => import("./views/Base/Breadcrumbs"),
  loading: Loading
});

const Cards = Loadable({
  loader: () => import("./views/Base/Cards"),
  loading: Loading
});

const Carousels = Loadable({
  loader: () => import("./views/Base/Carousels"),
  loading: Loading
});

const Collapses = Loadable({
  loader: () => import("./views/Base/Collapses"),
  loading: Loading
});

const Dropdowns = Loadable({
  loader: () => import("./views/Base/Dropdowns"),
  loading: Loading
});

const Forms = Loadable({
  loader: () => import("./views/Base/Forms"),
  loading: Loading
});

const Jumbotrons = Loadable({
  loader: () => import("./views/Base/Jumbotrons"),
  loading: Loading
});

const ListGroups = Loadable({
  loader: () => import("./views/Base/ListGroups"),
  loading: Loading
});

const Navbars = Loadable({
  loader: () => import("./views/Base/Navbars"),
  loading: Loading
});

const Navs = Loadable({
  loader: () => import("./views/Base/Navs"),
  loading: Loading
});

const Paginations = Loadable({
  loader: () => import("./views/Base/Paginations"),
  loading: Loading
});

const Popovers = Loadable({
  loader: () => import("./views/Base/Popovers"),
  loading: Loading
});

const ProgressBar = Loadable({
  loader: () => import("./views/Base/ProgressBar"),
  loading: Loading
});

const Switches = Loadable({
  loader: () => import("./views/Base/Switches"),
  loading: Loading
});

const Tables = Loadable({
  loader: () => import("./views/Base/Tables"),
  loading: Loading
});

const Tabs = Loadable({
  loader: () => import("./views/Base/Tabs"),
  loading: Loading
});

const Tooltips = Loadable({
  loader: () => import("./views/Base/Tooltips"),
  loading: Loading
});

const BrandButtons = Loadable({
  loader: () => import("./views/Buttons/BrandButtons"),
  loading: Loading
});

const ButtonDropdowns = Loadable({
  loader: () => import("./views/Buttons/ButtonDropdowns"),
  loading: Loading
});

const ButtonGroups = Loadable({
  loader: () => import("./views/Buttons/ButtonGroups"),
  loading: Loading
});

const Buttons = Loadable({
  loader: () => import("./views/Buttons/Buttons"),
  loading: Loading
});

const Charts = Loadable({
  loader: () => import("./views/Charts"),
  loading: Loading
});

const Dashboard = Loadable({
  loader: () => import("./views/Dashboard"),
  loading: Loading
});

const CoreUIIcons = Loadable({
  loader: () => import("./views/Icons/CoreUIIcons"),
  loading: Loading
});

const Flags = Loadable({
  loader: () => import("./views/Icons/Flags"),
  loading: Loading
});

const FontAwesome = Loadable({
  loader: () => import("./views/Icons/FontAwesome"),
  loading: Loading
});

const SimpleLineIcons = Loadable({
  loader: () => import("./views/Icons/SimpleLineIcons"),
  loading: Loading
});

const Alerts = Loadable({
  loader: () => import("./views/Notifications/Alerts"),
  loading: Loading
});

const Badges = Loadable({
  loader: () => import("./views/Notifications/Badges"),
  loading: Loading
});

const Modals = Loadable({
  loader: () => import("./views/Notifications/Modals"),
  loading: Loading
});

const Colors = Loadable({
  loader: () => import("./views/Theme/Colors"),
  loading: Loading
});

const Typography = Loadable({
  loader: () => import("./views/Theme/Typography"),
  loading: Loading
});

const Widgets = Loadable({
  loader: () => import("./views/Widgets/Widgets"),
  loading: Loading
});

// IMS app changes
const AddFees = Loadable({
  loader: () => import("./views/admin/finance/addFees/AddFees"),
  loading: Loading
});

const ViewFees = Loadable({
  loader: () => import("./views/admin/finance/viewFees/ViewFees"),
  loading: Loading
});

const FeeTemplates = Loadable({
  loader: () => import("./views/admin/finance/feeTemplates/FeeTemplates"),
  loading: Loading
});

const ManageVehicles = Loadable({
  loader: () => import("./views/admin/transport/ManageVehicles"),
  loading: Loading
});

const ManageStops = Loadable({
  loader: () => import("./views/admin/transport/ManageStops"),
  loading: Loading
});

const ManageRoutes = Loadable({
  loader: () => import("./views/admin/transport/ManageRoutes"),
  loading: Loading
});

const AssignStudents = Loadable({
  loader: () => import("./views/admin/transport/AssignStudents"),
  loading: Loading
});


const RegisterUser = Loadable({
  loader: () => import("./views/admin/registeruser/RegisterUser"),
  loading: Loading
});

const UserDetails = Loadable({
  loader: () => import("./views/admin/userdetails/UserDetails"),
  loading: Loading
});

const ImportUser = Loadable({
  loader: () => import("./views/admin/importuser/ImportUser"),
  loading: Loading
});

const CreateItems = Loadable({
  loader: () => import("./views/admin/inventory/CreateItems"),
  loading: Loading
});
const AddBook = Loadable({
  loader: () => import("./views/admin/library/AddBook"),
  loading: Loading
});

const ImportBulkBooks = Loadable({
  loader: () => import("./views/admin/library/ImportBulkBooks"),
  loading: Loading
});

const IssueBooks = Loadable({
  loader: () => import("./views/admin/library/IssueBooks"),
  loading: Loading
});

const ReturnBooks = Loadable({
  loader: () => import("./views/admin/library/ReturnBooks"),
  loading: Loading
});

const EditCategory = Loadable({
  loader: () => import("./views/admin/library/EditCategory"),
  loading: Loading
});

const SearchBooks = Loadable({
  loader: () => import("./views/admin/library/SearchBooks"),
  loading: Loading
});

const ItemHistory = Loadable({
  loader: () => import("./views/admin/inventory/ItemHistory"),
  loading: Loading
});



const SearchUser = Loadable({
  loader: () => import("./views/admin/searchuser/SearchUser"),
  loading: Loading
});

const Users = Loadable({
  loader: () => import("./views/admin/users/Users"),
  loading: Loading
});


const AddItems = Loadable({
  loader: () => import("./views/admin/inventory/AddItems"),
  loading: Loading
});

const ConsumeItems = Loadable({
  loader: () => import("./views/admin/inventory/ConsumeItems"),
  loading: Loading
});

const ClassDetails = Loadable({
  loader: () => import("./views/admin/classmanagement/ClassDetails"),
  loading: Loading
});

const CreateClass = Loadable({
  loader: () => import("./views/admin/classmanagement/CreateClass"),
  loading: Loading
});

const ClassTimeTable = Loadable({
  loader: () => import("./views/admin/classmanagement/ClassTimeTable"),
  loading: Loading
});

const Attendance = Loadable({
  loader: () => import("./views/admin/classmanagement/Attendance"),
  loading: Loading
});

const SendMail = Loadable({
  loader: () => import("./views/admin/classmanagement/SendMail"),
  loading: Loading
});

const ClassFeeTemplate = Loadable({
  loader: () => import("./views/admin/classmanagement/ClassFeeTemplate"),
  loading: Loading
});

const CreateExam = Loadable({
  loader: () => import("./views/admin/exams/CreateExam"),
  loading: Loading
});

const ScheduleExam = Loadable({
  loader: () => import("./views/admin/exams/ScheduleExam"),
  loading: Loading
});

const AddResults = Loadable({
  loader: () => import("./views/admin/exams/AddResults"),
  loading: Loading
});

const ViewResults = Loadable({
  loader: () => import("./views/admin/exams/ViewResults"),
  loading: Loading
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [

  { path: "/admin", exact: true, name: "Admin", component: RegisterUser },

  { path: "/admin/library/AddBook", exact: true, name: "Add Book", component: AddBook },
  { path: "/admin/library/ImportBulkBooks", exact: true, name: "Import Bulk Books", component: ImportBulkBooks },


  { path: "/admin/library/IssueBooks", exact: true, name: "Issue Books", component: IssueBooks },
  { path: "/admin/library/ReturnBooks", exact: true, name: "Return Books", component: ReturnBooks },
  { path: "/admin/library/SearchBooks", exact: true, name: "Search/Edit Books", component: SearchBooks },
  { path: "/admin/library/EditCategory", exact: true, name: "EditCategory", component: EditCategory },


  {
    path: "/admin/transport/ManageVehicles",
    name: "Manage Vehicles",
    component: ManageVehicles
  },

  {
    path: "/admin/transport/ManageStops",
    name: "Manage Stops",
    component: ManageStops
  },

  {
    path: "/admin/transport/ManageRoutes",
    name: "Manage Routes",
    component: ManageRoutes
  },

  {
    path: "/admin/transport/AssignStudents",
    name: "Assign Students",
    component: AssignStudents
  },


  {
    path: "/admin/exams/CreateExam",
    name: "Create Exam",
    component: CreateExam
  },
  {
    path: "/admin/exams/ScheduleExam",
    name: "Schedule Exam",
    component: ScheduleExam
  },

  {
    path: "/admin/exams/AddResults",
    name: "Add Results",
    component: AddResults
  },

  {
    path: "/admin/exams/ViewResults",
    name: "View Results",
    component: ViewResults
  },





  {
    path: "/admin/inventory/AddItems",
    name: "Add Items",
    component: AddItems
  },

  {
    path: "/admin/inventory/ItemHistory",
    name: "Items History",
    component: ItemHistory
  },

  {
    path: "/admin/inventory/CreateItems",
    name: "Create Items",
    component: CreateItems
  },

  {
    path: "/admin/inventory/ConsumeItems",
    name: "Consume Items",
    component: ConsumeItems
  },

  {
    path: "/admin/registeruser",
    name: "Register User",
    component: RegisterUser
  },
{
    path: "/admin/userdetails",
    exact: true,
    name: "User Details",
    component: UserDetails
  },

  { path: '/admin/userdetails/:username',
  exact: true,
  name: "User Details",
    component: UserDetails
   },
  {
    path: "/admin/importuser",
    name: "Import User",
    component: ImportUser
  },
  {
    path: "/admin/finance/addFees",
    exact: true,
    name: "Add Fees",
    component: AddFees
  },

  {
    path: "/admin/finance/viewFees",
    exact: true,
    name: "View Fees",
    component: ViewFees
  },



  {
    path: "/admin/finance/FeeTemplates",
    name: "Fee Templates",
    component: FeeTemplates
  },
  {
    path: "/admin/searchuser",
    name: "Search User",
    component: SearchUser
  },
  {
    path: "/admin/users",
    name: "Users",
    component: Users
  },
  {
    path: "/admin/classmanagement/ClassDetails",
    name: "ClassDetails",
    component: ClassDetails
  },
  {
    path: "/admin/classmanagement/CreateClass",
    name: "CreateClass",
    component: CreateClass
  },
  {
    path: "/admin/classmanagement/Attendance",
    name: "Attendance",
    component: Attendance
  },
  {
    path: "/admin/classmanagement/SendMail",
    name: "SendMail",
    component: SendMail
  },
  {
    path: "/admin/classmanagement/ClassTimeTable",
    name: "ClassTimeTable",
    component: ClassTimeTable
  },
  {
    path: "/admin/classmanagement/ClassFeeTemplate",
    name: "ClassFeeTemplate",
    component: ClassFeeTemplate
  },





  { path: "/", exact: true, name: "Home", component: DefaultLayout },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/theme", exact: true, name: "Theme", component: Colors },
  { path: "/theme/colors", name: "Colors", component: Colors },
  { path: "/theme/typography", name: "Typography", component: Typography },
  { path: "/base", exact: true, name: "Base", component: Cards },
  { path: "/base/cards", name: "Cards", component: Cards },
  { path: "/base/forms", name: "Forms", component: Forms },
  { path: "/base/switches", name: "Switches", component: Switches },
  { path: "/base/tables", name: "Tables", component: Tables },
  { path: "/base/tabs", name: "Tabs", component: Tabs },
  { path: "/base/breadcrumbs", name: "Breadcrumbs", component: Breadcrumbs },
  { path: "/base/carousels", name: "Carousel", component: Carousels },
  { path: "/base/collapses", name: "Collapse", component: Collapses },
  { path: "/base/dropdowns", name: "Dropdowns", component: Dropdowns },
  { path: "/base/jumbotrons", name: "Jumbotrons", component: Jumbotrons },
  { path: "/base/list-groups", name: "List Groups", component: ListGroups },
  { path: "/base/navbars", name: "Navbars", component: Navbars },
  { path: "/base/navs", name: "Navs", component: Navs },
  { path: "/base/paginations", name: "Paginations", component: Paginations },
  { path: "/base/popovers", name: "Popovers", component: Popovers },
  { path: "/base/progress-bar", name: "Progress Bar", component: ProgressBar },
  { path: "/base/tooltips", name: "Tooltips", component: Tooltips },
  { path: "/buttons", exact: true, name: "Buttons", component: Buttons },
  { path: "/buttons/buttons", name: "Buttons", component: Buttons },
  {
    path: "/buttons/button-dropdowns",
    name: "Button Dropdowns",
    component: ButtonDropdowns
  },
  {
    path: "/buttons/button-groups",
    name: "Button Groups",
    component: ButtonGroups
  },
  {
    path: "/buttons/brand-buttons",
    name: "Brand Buttons",
    component: BrandButtons
  },
  { path: "/icons", exact: true, name: "Icons", component: CoreUIIcons },
  { path: "/icons/coreui-icons", name: "CoreUI Icons", component: CoreUIIcons },
  { path: "/icons/flags", name: "Flags", component: Flags },
  { path: "/icons/font-awesome", name: "Font Awesome", component: FontAwesome },
  {
    path: "/icons/simple-line-icons",
    name: "Simple Line Icons",
    component: SimpleLineIcons
  },
  {
    path: "/notifications",
    exact: true,
    name: "Notifications",
    component: Alerts
  },
  { path: "/notifications/alerts", name: "Alerts", component: Alerts },
  { path: "/notifications/badges", name: "Badges", component: Badges },
  { path: "/notifications/modals", name: "Modals", component: Modals },
  { path: "/widgets", name: "Widgets", component: Widgets },
  { path: "/charts", name: "Charts", component: Charts },
];

export default routes;
