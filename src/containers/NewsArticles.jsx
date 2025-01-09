import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import PlaceholderBanner from '/images/BannerPlaceholder.png'
import { fetchNewsArticles } from '../Functions/functions'
import { formatDate } from '../utils/app.utils'
import CardLoader from '../components/cardLoader/CardLoader'
import Loader from '../components/Loader/Loader'

function NewsArticles({ colorTheme }) {
  const { id } = useParams()
  const [newsData, setNewsData] = useState([])
  const [bannerData, setBannerData] = useState([])
  const [index, setIndex] = useState(2)
  const [totalNews, setTotalNews] = useState(3)
  const [loading, setLoading] = useState(false)
  const [totalNewsCount, setTotalNewsCount] = useState(0);
  const [isAllNewsLoaded, setIsAllNewsLoaded] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchNewsArticles(id).then((response) => {
        if (response.success) {
          setTotalNews(response?.data?.totalCount)
          const updatedBannerArray = []
          const updatedNewsArray = []
          if (response?.data?.data?.length === 1) {
            setBannerData(response.data.data.isBanner === true || response.data.data[0])
          } else {
            response.data.data.forEach((item) => {
              if (item?.isBanner && updatedBannerArray?.length === 0) {
                updatedBannerArray.push(item)
              } else {
                updatedNewsArray.push(item)
              }
            })
            setBannerData(updatedBannerArray[0] || response.data.data[0])
            if (updatedBannerArray?.length === 0) updatedNewsArray.shift()
            setNewsData(
              updatedNewsArray.filter(
                (result) => result._id !== updatedBannerArray[0]?._id,
              ),
            )
          }
        }
        setLoading(false)
      }).catch((err) => {
        console.log(err);
        setLoading(false)

      })
      setLoading(false)
    }
  }, [id])

  const loadMoreNews = () => {
    fetchNewsArticles(id, index)
      .then((res) => {
        const newNews = res.data.data;
        setNewsData((prevItems) => [...prevItems, ...newNews]);

        // Set total count if not already set
        if (!totalNewsCount) {
          setTotalNewsCount(res.data.total || 0);
        }

        // Check if all news are loaded
        const totalLoaded = [...newsData, ...newNews].length;
        if (totalLoaded >= totalNewsCount) {
          setIsAllNewsLoaded(true);
        }
      })
      .catch((err) => console.error("Error loading news:", err));

    setIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return <Loader />
  }


  console.log(newsData, "newsData", bannerData)


  return (
    <div id='news' style={{ minHeight: "100vh" }}>
      {/* Banner Section */}
      {bannerData && bannerData?.length !== 0 && <section className="banner-section" style={styles.bannerSection}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6">
              <div style={styles.bannerImage}>
                {bannerData?.image ? <img
                  src={bannerData?.image}
                  alt="Banner"
                  style={styles.image}
                />
                  : <LinkPreview url={bannerData?.link} />}
              </div>
            </div>
            <div className={` ${bannerData?.length === 0 && "d-none"} col-12 col-lg-6 d-flex flex-column justify-content-center`}>
              <h1 style={styles.bannerTitle}>{bannerData?.title}</h1>
              <p style={styles.bannerDescription}>{bannerData?.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span style={styles.date}>
                  Published: {formatDate(bannerData?.createdAt)}
                </span>
                <a
                  href={bannerData?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.visitButton, backgroundColor: colorTheme }}
                  className="btn btn-dark text-white radius-theme box-shadow theme"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>}
      {/* News Articles Section */}
      <section className="news-articles-section" style={styles.newsSection}>
        <div className="container">
          <div className="row">
            {(newsData?.length === 0 && bannerData?.length === 0 && !loading) || (newsData?.length === 0 && !bannerData && !loading) ? <EmptyComponent /> : newsData?.map((item, index) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={index}
                style={styles.cardContainer}
              >
                <div style={styles.card}>
                  <div style={styles.cardImage}>
                    {item?.image ? <img
                      src={item?.image}
                      alt="Banner"
                      style={styles.image}
                    />
                      : <LinkPreview url={bannerData?.link} />}
                  </div>
                  <div style={styles.cardContent}>
                    <h2 style={styles.cardTitle}>{item?.title}</h2>
                    <p style={styles.cardDescription}>
                      {item?.description?.substring(0, 150)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={styles.date}>
                        Published: {formatDate(item?.createdAt)}
                      </span>
                      <a
                        href={item?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...styles.visitButton,
                          backgroundColor: colorTheme,
                        }}
                        // style={styles.visitButton}
                        className="btn btn-dark text-white radius-theme box-shadow theme"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className={`${newsData?.length === 0 && "d-none"} d-flex justify-content-center align-items-center w-full `}>
              {totalNewsCount > 0 && !isAllNewsLoaded && newsData.length < totalNewsCount && (
                <div className="text-center mt-4">
                  <button
                    className='btn btn-dark text-white radius-theme box-shadow theme'
                    onClick={loadMoreNews}
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function LinkPreview({ url }) {
  const [previewData, setPreviewData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isYouTubeVideo = isYouTubeURL(url)
    if (isYouTubeVideo) {
      setPreviewData({
        youtube: true,
      })
      setLoading(false)
    }
    const fetchData = async () => {
      try {
        const response = await fetch(url)
        const data = await response.text()

        if (!isYouTubeVideo) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(data, 'text/html')
          const title = doc.querySelector('title')?.textContent || ''
          const description =
            doc
              .querySelector('meta[name="description"]')
              ?.getAttribute('content') || ''
          const image =
            doc
              .querySelector('meta[property="og:image"]')
              ?.getAttribute('content') || ''

          setPreviewData({
            title,
            description,
            image,
            youtube: false,
          })
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }
    if (!isYouTubeVideo) {
      fetchData()
    }
  }, [url])

  const isYouTubeURL = (url) => {
    return url?.includes('youtube.com') || url?.includes('youtu.be')
  }

  if (loading) {
    return <CardLoader />
  }

  if (!previewData) {
    return (
      <div className="overflow-hidden  rounded" style={{ cursor: 'pointer' }}>
        <img
          src={PlaceholderBanner}
          alt="Link Preview"
          style={styles.image}
        />
      </div>
    )
  }

  if (previewData?.youtube) {
    return (
      <div className="overflow-hidden  rounded" style={{ cursor: 'pointer' }}>
        <iframe src={url} frameBorder="0" style={styles.image}></iframe>
      </div>
    )
  }

  const handleClick = () => {
    window.open(url, '_blank')
  }

  if (previewData.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img src={previewData.videoThumbnail} alt="Video Thumbnail" />
      </div>
    )
  }
  return (
    <div
      className="overflow-hidden  rounded"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {previewData.image && (
        <img
          src={previewData?.image}
          alt="Link Preview"
          className="w-100 h-100"
        />
      )}
    </div>
  )
}

const EmptyComponent = () => {
  return (
    <div className='w-full  d-flex justify-content-center align-items-center'>
      <img className='w-75' width={'50vh'} src="https://cdn.dribbble.com/users/2382015/screenshots/6065978/media/8b4662f8023e4e2295f865106b5d3aa7.gif" alt="" />
    </div>
  )
}

export default NewsArticles

const styles = {
  bannerSection: {
    backgroundColor: '#f7f7f7',
    padding: '40px 20px',
    borderRadius: '15px',
    marginBottom: '30px',
  },
  bannerImage: {
    overflow: 'hidden',
    borderRadius: '10px',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    minHeight: '225px',
  },
  bannerTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    color: '#333',
    marginBottom: '15px',
  },
  bannerDescription: {
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    color: '#666',
    marginBottom: '15px',
  },
  visitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    // borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  date: {
    fontStyle: 'italic',
    fontSize: '12px',
    color: '#888',
  },
  newsSection: {
    backgroundColor: '#fff',
    padding: '20px 0',
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardImage: {
    overflow: 'hidden',
  },
  cardContent: {
    padding: '15px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    fontFamily: 'Georgia, serif',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px',
    fontFamily: 'Arial, sans-serif',
  },
  loader: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#555',
  },
}
