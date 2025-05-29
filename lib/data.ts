const data = {
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
    {
      title: 'Most Popular Equipments For Sale',
      buttonCaption: 'Shop Now',
      image: '/images/banner-3.jpg',
      url: '/search?category=Glass Profiles',
      isPublished: true,
    },
    {
      title: 'Best Sellers in Door Hardware',
      buttonCaption: 'Shop Now',
      image: '/images/banner-1.jpg',
      url: '/search?category=Door Hardware',
      isPublished: true,
    },
    {
      title: 'Best Deals on Door Locks',
      buttonCaption: 'See More',
      image: '/images/banner-2.jpg',
      url: '/search?category=Door Locks',
      isPublished: true,
    },
  ],
}

export default data
