# Agent kuralları — Araç Özellik Bakım

Bu repoda çalışan agent:

1. Kod değişince **commit** atar
2. Hemen ardından **`scripts/auto-push.sh`** ile GitHub’a **push** eder
3. Token yoksa kullanıcıdan `GITHUB_TOKEN` secret ister; sohbete token yazdırmaz

Hedef: https://github.com/ykslaksoy/arac-ozellik-bakim (main)
