import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import InfiniteScroll from "react-infinite-scroll-component";

import PlaceholderBanner from "/images/BannerPlaceholder.png";
import { fetchNewsArticles } from '../Functions/functions';
import { formatDate } from '../utils/app.utils';

function NewsArticles({ colorTheme }) {

    const { id } = useParams();

    const [newsData, setNewsData] = useState([]);
    const [bannerData, setBannerData] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(2);

    useEffect(() => {
        fetchNewsArticles(id).then((response) => {
            if (response.success) {
                const updatedBannerArray = [];
                const updatedNewsArray = [];
                response.data.data.map((item) => {
                    if (item?.isBanner && updatedBannerArray.length !== 0) {
                        updatedBannerArray.push(item)
                    } else {
                        updatedNewsArray.push(item)
                    }
                })
                if (updatedBannerArray.length === 0) {
                    setBannerData(response.data.data[0])
                    updatedNewsArray.shift()
                    setNewsData(updatedNewsArray);
                } else {
                    setNewsData(updatedNewsArray.filter((result) => result._id !== updatedBannerArray[0]._id))
                }
            }
        })
    }, [id])

    const fetchMoreData = () => {
        fetchNewsArticles(id, index)
            .then((res) => {
                setNewsData((prevItems) => [...prevItems, ...res.data.data]);

                res.data.data.length > 0 ? setHasMore(true) : setHasMore(false);
            })
            .catch((err) => console.log(err));

        setIndex((prevIndex) => prevIndex + 1);
    };

    return (
        <>
            <section className="h-auto">
                <div className="container mt-2 p-top">
                    <div className="col-12 mt-5 text-center text-lg-start">
                        <h1 className="fw-bold text-center">News & Articles</h1>
                    </div>
                    <div className="row align-items-center banner-section shadow-lg py-3 " style={{ borderRadius: "15px" }}>
                        <div className="col-12 col-lg-6 text-end  overflow-hidden">
                            <LinkPreview url={bannerData?.link} />
                        </div>
                        {/* Text Content */}
                        <div className="col-12 col-lg-6">
                            <div className="row align-items-center">
                                <div className="col-12">
                                    <h1 className="text-start text-dark fw-bold david-font fw-bold  text-center text-sm-start">
                                        {bannerData?.title}
                                    </h1>
                                </div>
                                <div className="col-12 ">
                                    <p className="text-secondary text-center text-lg-start david-font">
                                        {bannerData?.description}
                                    </p>
                                </div>
                                <div className="mt-3 col-12">
                                    <div className="row">
                                        <div className="col-6 d-flex align-items-center">
                                            <p style={{ fontStyle: "italic", fontSize: " 12px" }} className='p-0 m-0 '>Date Published:{formatDate(bannerData?.createdAt)}</p>
                                        </div>
                                        <div className="col-6 ">
                                            <a
                                                style={{ backgroundColor: colorTheme }}
                                                target='_blank'
                                                href={bannerData?.link}
                                                className="btn btn-dark text-white radius-theme box-shadow theme w-100 p-1">
                                                visit
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="h-auto mb-4">
                <InfiniteScroll
                    dataLength={newsData.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<div className='m-auto text-center w-100 '><p>loading...</p></div>}
                >
                    <div className="container ">
                        <div className="row">
                            {newsData?.map((item, index) => (
                                <div key={index} className="col-12 col-lg-4 mx-1 mx-auto">
                                    <div className="row align-items-center banner-section shadow-lg rounded mx-1 ">
                                        <div className="col-12  pt-3">
                                            <LinkPreview url={item?.link} />
                                        </div>
                                        <div className="col-12 ">
                                            <div className="row align-items-center">
                                                <div className="col-12">
                                                    <p className="text-start text-dark fw-bold david-font fw-bold  text-center text-sm-start">
                                                        {item?.title}
                                                    </p>
                                                </div>
                                                <div className="col-12 ">
                                                    <p className="text-secondary text-start text-xs-start david-font">
                                                        {item?.description?.substring(0, 300)}...
                                                    </p>
                                                </div>
                                                <div className="mb-3 col-12">
                                                    <div className="row">
                                                        <div className="col-6 d-flex align-items-center">
                                                            <p className='m-0 p-0' style={{ fontStyle: "italic", fontSize: " 10px" }}>Date Published:{formatDate(item?.createdAt)}</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <a
                                                                target='_blank'
                                                                href={item?.link}
                                                                style={{ backgroundColor: colorTheme }}
                                                                className="btn btn-dark text-white radius-theme box-shadow theme w-100 p-1">
                                                                visit
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </InfiniteScroll>
            </section>
        </>
    )
}

export default NewsArticles

function LinkPreview({ url }) {
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isYouTubeVideo = isYouTubeURL(url);
        if (isYouTubeVideo) {
            setPreviewData({
                youtube: true
            });
            setLoading(false);
        }
        const fetchData = async () => {
            try {

                const response = await fetch(url);
                const data = await response.text();

                if (!isYouTubeVideo) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const title = doc.querySelector('title')?.textContent || '';
                    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                    const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

                    setPreviewData({
                        title,
                        description,
                        image,
                        youtube: false,
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (!isYouTubeVideo) {

            fetchData();
        }
    }, [url]);

    const isYouTubeURL = (url) => {
        return url?.includes('youtube.com') || url?.includes('youtu.be');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!previewData) {
        return (
            <div className='overflow-hidden  rounded' style={{ cursor: 'pointer' }}>
                <img src={PlaceholderBanner} alt="Link Preview" className='w-100 h-100' />
            </div>
        )
    }

    if (previewData?.youtube) {
        return (<div className='overflow-hidden  rounded' style={{ cursor: 'pointer' }}>
            <iframe src={url} frameBorder="0" className='w-100 h-100'></iframe>
        </div>)
    }

    const handleClick = () => {
        window.open(url, '_blank');
    };

    if (previewData.videoId) {
        return (
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <img src={previewData.videoThumbnail} alt="Video Thumbnail" />
            </div>
        );
    }
    return (
        <div className='overflow-hidden  rounded' onClick={handleClick} style={{ cursor: 'pointer' }}>
            {previewData.image && <img src={previewData?.image} alt="Link Preview" className='w-100 h-100' />}
        </div>
    );
}
