<template>
  <div class="table-container">
    <n-table size="medium" bordered class="combined-table">
      <tbody>
        <tr v-for="(value, key) in firstTableData" :key="key">
          <td class="key-column">
            {{ $t(key) }}
            <help-text style="align-items: center" :text="value.helpText" />
          </td>
          <td class="value-column">{{ value.value }}</td>
        </tr>

        <tr v-for="(value, key) in secondTableData" :key="key">
          <td class="key-column">
            {{ $t(key) }}
            <help-text style="align-items: center" :text="value.helpText" />
          </td>
          <td class="value-column">{{ value.value }}</td>
        </tr>

        <tr v-for="(value, index) in thirdTableData" :key="index">
          <td class="key-column">
            <span class="total-cost-text">{{ $t('totalCostFor') }}</span>
            <n-popover trigger="hover" placement="top-start">
              <template #trigger>
                <span class="client-name">
                  {{ value.client }}
                </span>
              </template>
              <div class="popover-content">
                {{ value.client }}
              </div>
            </n-popover>
          </td>
          <td class="value-column">{{ value.calculated_cost }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
<script>
import HelpText from '@/components/HelpText.vue';
import { mapStores } from 'pinia';
import { useOfferStore } from '@/store/offer.js';
import { formattedDateStartEndDate } from '@/utils/time';
import { getOfferAggregates } from '@/api/offer';
import { useOfferStagesStore } from '@/store/offerStages';
import { formatNumber } from '@/utils/numeric';
import moment from 'moment';

export default {
  name: 'OfferAggregates',
  components: { HelpText },
  props: {
    selectedOffer: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      firstTableData: {},
      secondTableData: {},
      thirdTableData: [],
      isLoading: false,
      data: null,
    };
  },
  computed: {
    ...mapStores(useOfferStore, useOfferStagesStore),
  },
  watch: {
    '$i18n.locale': function (newLocale) {
      moment.locale(newLocale);
      this.updateTables();
    },
    selectedOffer(newOffer) {
      if (newOffer) {
        this.updateTables();
      }
    },
  },
  async created() {
    moment.locale(this.$i18n.locale);
    if (this.$route.params.offerId) {
      await this.updateTables();
    }
  },
  methods: {
    formatDate(startDate, endDate) {
      return formattedDateStartEndDate(startDate, endDate, this.$i18n.locale);
    },
    async fetchOfferAggregates(id) {
      this.isLoading = true;
      this.data = await getOfferAggregates(id);

      this.prepareFirstTableData();
      this.prepareSecondTableData();
      this.prepareThirdTableData();

      this.isLoading = false;

      if (this.data === null || this.data.length === 0) {
        this.firstTableData = {
          period: {
            value: '0 (0 ' + this.$t('days') + ')',
            helpText: 'helpTextPeriod',
          },
          numberOfRoles: {
            value: 0,
            helpText: 'helpTextRolesNum',
          },
          totalHours: {
            value: 0,
            helpText: 'helpTextTotalHours',
          },
          laborCost: {
            value: 0,
            helpText: 'helpTextLaborCost',
          },
        };

        this.secondTableData = {
          totalBonus: {
            value: 0,
            helpText: 'helpTextTotalBonus',
          },
          totalOpex: {
            value: 0,
            helpText: 'helpTextTotalOpex',
          },
          totalCost: {
            value: 0,
            helpText: 'helpTextTotalCost',
          },
        };
      }
    },
    prepareFirstTableData() {
      if (!this.data || this.data.length === 0) {
        return;
      }
      this.firstTableData = {
        period: {
          value:
            this.formatDate(this.data.start_date, this.data.end_date) +
            ` (${this.data.working_days} ${this.$t('days')})`,
          helpText: 'helpTextPeriod',
        },
        numberOfRoles: {
          value: this.data.num_roles,
          helpText: 'helpTextRolesNum',
        },
        totalHours: {
          value: formatNumber(this.data.total_hours),
          helpText: 'helpTextTotalHours',
        },
        laborCost: {
          value: formatNumber(this.data.labor_cost || 0),
          helpText: 'helpTextLaborCost',
        },
      };
    },

    prepareSecondTableData() {
      if (!this.data || this.data.length === 0) {
        return;
      }
      this.secondTableData = {
        totalBonus: {
          value: formatNumber(this.data.total_bonus || 0),
          helpText: 'helpTextTotalBonus',
        },
        totalOpex: {
          value: formatNumber(this.data.total_opex_amount || 0),
          helpText: 'helpTextTotalOpex',
        },
        totalCost: {
          value: formatNumber(this.data.total_cost || 0),
          helpText: 'helpTextTotalCost',
        },
      };
    },

    prepareThirdTableData() {
      if (!this.data || !this.data.calculated_costs || this.data.length === 0) {
        this.thirdTableData = [{ client: '', calculated_cost: 0 }];
        return;
      }
      this.thirdTableData = this.data.calculated_costs.map((source) => ({
        client: source.client_name,
        calculated_cost: formatNumber(source.cost || 0),
      }));
    },

    async updateTables() {
      const offerId = this.$route.params.offerId;
      if (offerId) {
        await this.fetchOfferAggregates(offerId);
      }
    },
    formatNumber,
  },
};
</script>
<style scoped>
.table-container {
  width: 100%;
}

.combined-table {
  width: 100%;
  font-size: 14px;
  border-radius: 16px;
  margin-right: 30px;
}

.key-column {
  font-weight: bold;
  padding: 8px 12px;
  white-space: nowrap;
  border-right: 1px solid #2b2b2b;
  display: flex;
}

.value-column {
  text-align: right;
  padding: 8px 12px;
}

.popover-content {
  padding: 4px 8px;
  max-width: 300px;
  word-wrap: break-word;
}
.total-cost-text {
  display: inline;
  margin-right: 4px;
}

.client-name {
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
