import React from 'react';

const RATINGS = {
  TARGET: "TARGET",
  RED: "RED",
  YELLOW: "YELLOW",
  BLUE: "BLUE",
  GREEN: "GREEN",
  GRAY: "GRAY",
  WHITE: "WHITE",
}

const RATING_HEX_COLORS = {
  [RATINGS.TARGET]: "#e00",
  [RATINGS.RED]: "#e00",
  [RATINGS.YELLOW]: "#dc0",
  [RATINGS.BLUE]: "#66f",
  [RATINGS.GREEN]: "#00a900",
  [RATINGS.GRAY]: "#999",
  [RATINGS.WHITE]: "#fff",
}

export const getRatingColor = rating => {
  if (rating >= 3000) {
    return {color: RATINGS.TARGET, progress: 1}
  } else if (rating >= 2200) {
    return {color: RATINGS.RED, progress: (rating - 2200) / (3000 - 2200)}
  } else if (rating >= 1500) {
    return {color: RATINGS.YELLOW, progress: (rating - 1500) / (2200 - 1500)}
  } else if (rating >= 1200) {
    return {color: RATINGS.BLUE, progress: (rating - 1200) / (1500 - 1200)}
  } else if (rating >= 900) {
    return {color: RATINGS.GREEN, progress: (rating - 900) / (1200 - 900)}
  } else if (rating >= 0) {
    return {color: RATINGS.GRAY, progress: (rating - 0) / (900 - 0)}
  } else {
    return {color: RATINGS.WHITE, progress: 0}
  }
}

export default function RatingIcon(props) {
  const { color, progress } = getRatingColor(props.rating);

  return (
    <div class="ratingIcon" style={{display: "inline-block", position: "relative", width: 14, height: 14}}>
      {
        color === RATINGS.TARGET ?
          <React.Fragment>
            <div style={{position: "absolute", boxSizing: "border-box", top: 0, left: 0, width: 14, height: 14, borderRadius: "50%", backgroundColor: RATING_HEX_COLORS[color]}} />
            <div style={{position: "absolute", boxSizing: "border-box", top: 1.2, left: 1.2, width: 11.6, height: 11.6, borderRadius: "50%", borderWidth: 1.2, borderStyle: "solid", borderColor: "#fff"}} />
            <div style={{position: "absolute", boxSizing: "border-box", top: 3.6, left: 3.6, width: 6.8, height: 6.8, borderRadius: "50%", borderWidth: 1.2, borderStyle: "solid", borderColor: "#fff"}} />
          </React.Fragment>
        : color === RATINGS.WHITE ?
          null
        :
          <React.Fragment>
            <div style={{position: "absolute", boxSizing: "border-box", top: 0, left: 0, width: 14, height: 14, borderRadius: "50%", backgroundColor: RATING_HEX_COLORS[color], clip: `rect(${14 * (1-progress)}px, 14px, 14px, 0)`}} />
            <div style={{position: "absolute", boxSizing: "border-box", top: 0, left: 0, width: 14, height: 14, borderRadius: "50%", borderWidth: 1, borderStyle: "solid", borderColor: RATING_HEX_COLORS[color]}} />
          </React.Fragment>
      }
    </div>
  )
}
