import Home from "../pages/home";
import Reciepe from './../pages/reciepe/index';
import Careers from "../pages/Careers/Careers";
import WhoWeAre from "../pages/WhoWeAre/WhoWeAre";
import Certifications from "../pages/Certifications/Certifications";
import Export from "../pages/Export/Export";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import Brands from "../pages/brands";
import BrandCategoryData from "../pages/BrandCategoryData";
import ContactUs from "../pages/contactUs";
import ProductType from "../pages/productType/productType";
import ProductTypeCategory from "../pages/productType/productTypeCategory";
import ExportCatalog from "../pages/ExportCatalog/ExportCatalog";
export const routes = [
  {
    route: "/:lang",
    component: <Home />,
  },
  {
    route: "/Reciepe/:lang",
    component: <Reciepe />,
  },
 {
    route: "/about/ProductType/:lang",
    component: <ProductType />,
  }, {
    route: "/about/whoWeAre/:lang",
    component: <WhoWeAre />,
  },
  {
    route: "/career/:lang",
    component: <Careers />,
  },
  {
    route: "/export/:lang",
    component: <Export />,
  },
  {
    route: "/ExportCatalog/:lang",
    component: <ExportCatalog />,
  }

  ,{
    route: "/brands/ProductType/ProductTypeCategory/:brandName/:id/:brandId/:categoryName/:categoryId/:lang",
    component: <ProductTypeCategory />,
  },

  {
    route: "/about/certifications/:lang",
    component: <Certifications />,
  },
  {
    route: "/Brands/:brandName/:brandId/:id/:brandCategoryName/:lang",
    component: <Brands />,
  },
  {
    route: "/recipe_details/:id/:recName/:recId/:foodName/:foodId/:lang",
    component: <RecipeDetails />,
  },
  {
    route: "/ContactUs/:lang",
    component: <ContactUs />,
  },{
    route: "/Brands/:id/:lang",
    component: <BrandCategoryData />,
  },
];
