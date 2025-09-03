<template>
  <div class="legend">
    <span class="legend-item">
      <span class="circle vacation"></span>
      <span class="label">{{ $t('vacation') }}</span>
    </span>
    <span class="legend-item">
      <span class="circle sick-leave"></span>
      <span class="label">{{ $t('sickLeave') }}</span>
    </span>
    <span class="legend-item">
      <span class="circle day-off"></span>
      <span class="label">{{ $t('dayOff') }}</span>
    </span>
    <span class="legend-item">
      <span class="circle work-off"></span>
      <span class="label">{{ $t('workOff') }}</span>
    </span>
    <span class="legend-item">
      <span class="circle holiday"></span>
      <span class="label">{{ $t('holiday') }}</span>
    </span>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  align-items: left;
}

.legend-item {
  display: flex;
  align-items: left;
  margin-right: 15px;
}

.circle {
  width: 13px;
  height: 13px;
}
.calendar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 10px;
}

.month {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}

.month h6 {
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  font-size: 14px;
  color: #333;
}

.day:hover {
  background: #e0e0e0;
}

.day.vacation {
  background-color: blue;
  color: white;
}

.day.holiday {
  background-color: red;
  color: white;
}

.day.sick-leave {
  background-color: CadetBlue;
  color: white;
}

.day.work-off {
  background-color: green;
  color: white;
}

.day.day-off {
  background-color: lightblue;
  color: white;
}

.legend {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.legend-item .circle {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
}

.legend-item .circle.vacation {
  background-color: blue;
}

.legend-item .circle.holiday {
  background-color: red;
}

.legend-item .circle.sick-leave {
  background-color: CadetBlue;
}

.legend-item .circle.work-off {
  background-color: green;
}

.legend-item .circle.day-off {
  background-color: lightblue;
}
</style>
