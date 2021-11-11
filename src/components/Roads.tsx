import { FC, createRef, forwardRef, useEffect, useState } from 'react'
import { RefObject } from 'react'

import { Divider, Button } from 'semantic-ui-react'
import { IRoad, IFavorite } from './types'
import Road from './Road'
import Ad from './Ad'

type RoadsProps = {
  roads: IRoad[]
  favorites: IFavorite[]
}

type RoadAndAdProps = {
  road: IRoad
}

type RefDataObject = {
  active: boolean
  road: IRoad
  ref: RefObject<HTMLDivElement>
  key: string
}

// eslint-disable-next-line react/display-name
const RoadAndAd = forwardRef((props: RoadAndAdProps, ref: any) => {
  const r = props.road
  return (
    <div ref={ref} key={`container-${r.urlFriendly}`}>
      <Road road={r} />
      <Divider />
      {process.env.REACT_APP_DISABLE_ADS !== 'true' && (
        <>
          <Ad />
          <Divider />
        </>
      )}
    </div>
  )
})

const Roads: FC<RoadsProps> = (props) => {
  const [isMobile, setMobile] = useState<boolean>(false)
  const refs: RefDataObject[] = []

  useEffect(() => {
    setMobile(window.innerWidth < 600 || window.innerHeight < 900)
  }, [])

  const roads = [...props.favorites]
    .reverse()
    .map((f) => props.roads.find((r) => r.urlFriendly === f))
    .filter(Boolean)
    .map((value, i) => {
      const r = value as IRoad
      const ref = createRef<HTMLDivElement>()
      refs.push({
        active: i === 0,
        ref,
        road: r,
        key: r.urlFriendly,
      })
      return <RoadAndAd ref={ref} key={r.urlFriendly} road={r} />
    })

  const scrollToNextRoad = (event: any) => {
    const button = event.target.closest('button')
    let activeRoadIndex = refs.findIndex((r) => r.active === true)
    refs[activeRoadIndex].active = false

    const nextRoadIndex = ++activeRoadIndex % refs.length
    const nextRoad = refs[nextRoadIndex]

    nextRoad.active = true
    refs[nextRoadIndex] = nextRoad
    nextRoad.ref.current?.scrollIntoView({
      behavior: 'smooth',
    })

    if (nextRoadIndex === refs.length - 1) {
      button.style.transform = 'rotate(-180deg)'
    } else {
      button.style.transform = 'rotate(0)'
    }
  }

  return (
    <>
      {roads}
      {isMobile && (
        <Button
          size="massive"
          color="red"
          circular
          active={false}
          icon="arrow down"
          onClick={(event) => scrollToNextRoad(event)}
          style={{
            zIndex: 10000,
            position: 'fixed',
            bottom: '25px',
            left: '50%',
            marginLeft: '-31px',
          }}
        />
      )}
    </>
  )
}

export default Roads
