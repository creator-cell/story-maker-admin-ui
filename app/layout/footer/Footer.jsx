// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import CustomLink from "../../components/CustomLink";
// import logo from "../../../public/images/footer-logo.png";
// import AliPay from "../../../public/images/images-removebg-preview.png";
// import AmericanExpress from "../../../public/images/Amex_logo_color-removebg-preview.png";
// import JCB from "../../../public/images/EmblemColor-1-removebg-preview.png";
// import PayPal from "../../../public/images/PayPal-Monogram-FullColor-RGB.png";
// import RevolutPay from "../../../public/images/RevolutPay-Logotype-White.png";
// import Visa from "../../../public/images/visa-brandmark-blue-1960x622.png";
// import UnionPay from "../../../public/images/UnionPay_logo.svg";
// import Mastercard from "../../../public/images/ma_symbol_opt_73_3x.png";
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import Slider from 'react-slick';

// function NextArrow(props) {
// 	const { className, style, onClick } = props;
// 	return (
// 		<div
// 			className={`${className} custom_arrow`}
// 			style={{ ...style }}
// 			onClick={onClick}
// 		/>
// 	);
// }

// function PrevArrow(props) {
// 	const { className, style, onClick } = props;
// 	return (
// 		<div
// 			className={`${className} custom_arrow`}
// 			style={{ ...style }}
// 			onClick={onClick}
// 		/>
// 	);
// }

// const Footer = (props) => {
// 	const sliderSetting = {
// 		dots: true,
// 		arrows: false,
// 		pauseOnHover: true,
// 		infinite: true,
// 		slidesToShow: 3,
// 		slidesToScroll: 1,
// 		autoplay: true,
// 		cssEase: "linear",
// 		nextArrow: <NextArrow />,
// 		prevArrow: <PrevArrow />,
// 		responsive: [
// 			{
// 				breakpoint: 991,
// 				settings: {
// 					slidesToShow: 2,
// 				}
// 			},
// 			{
// 				breakpoint: 576,
// 				settings: {
// 					slidesToShow: 1,
// 				}
// 			}
// 		]
// 	};

// 	const currentYear = new Date().getFullYear();

// 	const testimonials = [
// 		{
// 			id: 1,
// 			name: 'Emily Johnson',
// 			review: 'The booking process was easy and quick.\nCustomer service was very helpful.',
// 		},
// 		{
// 			id: 2,
// 			name: 'Michael Smith',
// 			review: 'Great experience from start to finish.\nHighly recommend for frequent travelers.',
// 		},
// 		{
// 			id: 3,
// 			name: 'Sofia Martinez',
// 			review: 'Super responsive support team.\nEverything went smoothly with no delays.',
// 		},
// 		{
// 			id: 4,
// 			name: 'James Lee',
// 			review: 'The site is clean and easy to use.\nPlenty of great travel tips available.',
// 		},
// 		{
// 			id: 5,
// 			name: 'Olivia Brown',
// 			review: 'Affordable pricing and fast booking.\nLoved the user-friendly interface.',
// 		},
// 		{
// 			id: 6,
// 			name: 'Daniel Wilson',
// 			review: 'Reliable service every single time.\nWill definitely use again for my trips.',
// 		}
// 	];


// 	return (
// 		<>
// 			<section className="testimonial">
// 				<div className="container">
// 					<div className="row">
// 						<div className="col-12">
// 							<div className="title">
// 								<h2>Customer Review</h2>
// 							</div>
// 						</div>
// 					</div>
// 					<div className="row">
// 						<div className="col-lg-12 col-md-12 col-12">
// 							<Slider {...sliderSetting}>
// 								{testimonials.map((item, index) => (
// 									<div key={index}>
// 										<div className="card" key={index}>
// 											<div className="card-body">
// 												<blockquote className="category-text">
// 													{item.review}
// 												</blockquote>
// 												<div className="testimonial_profile">
// 													<div className="d-flex flex-column mt-3">
// 														<h5 className="card-title">{item.name}</h5>
// 													</div>
// 												</div>
// 											</div>
// 										</div>
// 									</div>
// 								))}
// 							</Slider>
// 						</div>
// 					</div>
// 				</div>
// 			</section>
// 			<footer id="footer">
// 				<div className="foot-top">
// 					<div className="container">
// 						<div className="row">
// 							<div className="col-lg-3 col-md-5 col-12">
// 								<div className="foot-logo">
// 									<CustomLink href="/">
// 										<Image src={logo} width={250} height="auto" alt="" />
// 									</CustomLink>
// 								</div>
// 								<div className="foot-address">
// 									<b>Don't Be Shy.<span className="say-hello"> Say Hello.</span></b>
// 									<Link className="foot_data" target="_blank" href="mailto:hello@rivaroroaming.com">
// 										<i className="fa-solid fa-envelope"></i>hello@rivaroroaming.com
// 									</Link>
// 									<Link className="foot_data" target="_blank" href="tel:+443335776441">
// 										<i className="fa-solid fa-phone"></i>+44 333 577 6441
// 									</Link>
// 									{/* <Customink href="https://maps.app.goo.gl/zTA6TgAzRqToHZPG7" target="_blank">Rivaro Roaming,<br/> 71-75 Shelton Street,<br/> Covent Garden, US,<br/> WC2H 9JQ</CustomLink> */}
// 								</div>
// 								{/* <span>Company Registration Number 12345678</span> */}
// 							</div>
// 							<div className="col-lg-2 col-md-2 col-auto mt-lg-0 mt-md-0 mt-4">
// 								<div className="foot-link">
// 									<h6>Website</h6>
// 									<ul>
// 										<li><CustomLink href="/">Home</CustomLink></li>
// 										<li><CustomLink href="/about">About</CustomLink></li>
// 										<li><CustomLink href="/contact-us">Contact</CustomLink></li>
// 									</ul>
// 								</div>
// 							</div>
// 							<div className="col-lg-2 col-md-2 col-auto mt-lg-0 mt-md-0 mt-4">
// 								<div className="foot-link">
// 									<h6>eSIM</h6>
// 									<ul>
// 										<li>
// 											<CustomLink href="/local-esim">Local eSim</CustomLink>
// 										</li>
// 										<li>
// 											<CustomLink href="/regional-esim">Regional eSim</CustomLink>
// 										</li>
// 										<li>
// 											<CustomLink href="/global-esim">Global eSim</CustomLink>
// 										</li>
// 									</ul>
// 								</div>
// 							</div>
// 							<div className="col-lg-2 col-md-2 col-auto mt-lg-0 mt-md-0 mt-4">
// 								<div className="foot-link">
// 									<h6>Information</h6>
// 									<ul>
// 										<li>
// 											<CustomLink href="/privacy-policy">Privacy Policy</CustomLink>
// 										</li>
// 										<li>
// 											<CustomLink href="/terms-conditions">Terms & Conditions</CustomLink>
// 										</li>
// 										<li>
// 											<CustomLink href="/faqs">FAQ's</CustomLink>
// 										</li>
// 									</ul>
// 								</div>
// 							</div>
// 							<div className="col-lg-3 col-md-12 col-auto mt-lg-0 mt-md-4 mt-4">
// 								<div className="foot-social">
// 									<h5>Follow Us</h5>
// 									<div className="social_links">
// 										<Link href="#"><i className="fa-brands fa-facebook"></i></Link>
// 										<Link href="#"><i className="fa-brands fa-instagram"></i></Link>
// 										<Link href="#"><i className="fa-brands fa-youtube"></i></Link>
// 										<Link href="#"><i className="fa-brands fa-linkedin"></i></Link>
// 									</div>
// 								</div>
// 								<div className="payment_accepted">
// 									<h5>Payment Methods</h5>
// 									<div className="payment_links">
// 										<Image src={RevolutPay} alt="RevolutPay" width={40} height="auto" />
// 										<Image src={Visa} alt="Visa" width={40} height="auto" />
// 										<Image src={Mastercard} alt="Mastercard" width={40} height="auto" />
// 										<Image src={AmericanExpress} alt="AmericanExpress" width={40} height="auto" />
// 										<Image src={UnionPay} alt="UnionPay" width={40} height="auto" />
// 										<Image src={PayPal} alt="PayPal" width={40} height="auto" />
// 										<Image src={AliPay} alt="AliPay" width={40} height="auto" />
// 										<Image src={JCB} alt="JCB" width={40} height="auto" />
// 									</div>
// 								</div>
// 							</div>
// 							{/* <div className="col-lg-12 col-md-6 col-12">
// 							<div className="payment_accepted">
// 								<h5>Accepted Payment Methods</h5>
// 								<div className="payment_links">
// 									<Image src={RevolutPay} alt="RevolutPay" width={50} height="auto"/>
// 									<Image src={Visa} alt="Visa" width={50} height="auto"/>
// 									<Image src={Mastercard} alt="Mastercard" width={50} height="auto"/>
// 									<Image src={AmericanExpress} alt="AmericanExpress" width={50} height="auto"/>
// 									<Image src={UnionPay} alt="UnionPay" width={50} height="auto"/>
// 									<Image src={PayPal} alt="PayPal" width={50} height="auto"/>
// 									<Image src={AliPay} alt="AliPay" width={50} height="auto"/>
// 									<Image src={JCB} alt="JCB" width={50} height="auto"/>
// 								</div>
// 							</div>
// 						</div> */}
// 						</div>
// 					</div>
// 				</div>
// 				<div className="foot_bottom">
// 					<div className="container">
// 						<div className="row">
// 							<div className="col-lg-12 col-md-12 col-12">
// 								<div className="copy_rights">
// 									<span>© Copyright Rivaro Roaming {currentYear}. All rights reserved.</span>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</footer>
// 		</>
// 	)
// }
// export default Footer;