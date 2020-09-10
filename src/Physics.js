var Physics = {};
// POINT/RECTANGLE
Physics.pointRect = function (point, rect) {

  // is the point inside the rectangle's bounds?
  if (point.x >= rect.x &&        // right of the left edge AND
    point.x <= rect.x + rect.w &&   // left of the right edge AND
    point.y >= rect.y &&        // below the top AND
    point.y <= rect.y + rect.h) {   // above the bottom
    return true;
  }
  return false;
}

Physics.pointCircle = function (point, circle) {
  const dist = Math.pow(Math.pow(circle.x - point.x, 2) + Math.pow(circle.y - point.y, 2), 0.5);
  return dist <= circle.radius;
}

Physics.rectRect = function (rect1, rect2) {
  // are the sides of one rectangle touching the other?

  if (rect1.x + rect1.w >= rect2.x &&    // rect1 right edge past rect2 left
    rect1.x <= rect2.x + rect2.w &&    // rect1 left edge past rect2 right
    rect1.y + rect1.h >= rect2.y &&    // rect1 top edge past rect2 bottom
    rect1.y <= rect2.y + rect2.h) {    // rect1 bottom edge past rect2 top
    return true;
  }
  return false;
}